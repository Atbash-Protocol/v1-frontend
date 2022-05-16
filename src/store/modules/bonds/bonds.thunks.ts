import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers, constants, Contract, utils, BigNumber } from 'ethers';
import { snakeCase } from 'lodash';

import { BondingCalcContract } from 'abi';
import { BONDS } from 'config/bonds';
import { getAddresses } from 'constants/addresses';
import { messages } from 'constants/messages';
import { WEB3State } from 'contexts/web3/web3.types';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { createBond, getBondContractsAddresses } from 'lib/bonds/bonds.helper';
import { addNotification, walletConnectWarning } from 'store/modules/messages/messages.slice';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { getBlockchainData } from '../app/app.thunks';
import { addPendingTransaction, clearPendingTransaction } from '../transactions/transactions.slice';
import { TransactionTypeEnum } from '../transactions/transactions.type';
import { initDefaultBondMetrics } from './bonds.helper';
import { getLPBondQuote, getLPPurchasedBonds, getTokenBondQuote, getTokenPurchaseBonds } from './bonds.utils';

export const initializeBonds = createAsyncThunk('app/bonds', async (provider: WEB3State['provider'] | WEB3State['signer']) => {
    if (!provider) throw new Error('Bond initialization error');

    const signer = provider.getSigner();
    const chainID = await signer.getChainId();

    // init bond calculator
    const { BASH_BONDING_CALC_ADDRESS } = getAddresses(chainID);

    const bondCalculator = new Contract(BASH_BONDING_CALC_ADDRESS, BondingCalcContract, signer);

    const bondstoOutput = BONDS.reduce(
        (acc, bondConfig) => {
            const bondInstance = createBond({ ...bondConfig, networkID: chainID });

            const contracts = getBondContractsAddresses(bondConfig, chainID);

            bondInstance.initializeContracts(contracts, signer);

            const bondName = snakeCase(bondConfig.name);

            return {
                bondInstances: {
                    ...acc.bondInstances,
                    [bondName]: bondInstance,
                },
                bondMetrics: {
                    ...acc.bondMetrics,
                    [bondName]: initDefaultBondMetrics(),
                },
            };
        },
        {
            bondInstances: {},
            bondMetrics: {},
        },
    );

    return {
        ...bondstoOutput,
        bondCalculator,
    };
});

export const getTreasuryBalance = createAsyncThunk('bonds/bonds-treasury', async ({ networkID }: { networkID: number }, { getState }) => {
    const {
        bonds: { bondInstances, bondCalculator },
    } = getState() as IReduxState;

    const { TREASURY_ADDRESS } = getAddresses(networkID);

    if (!bondCalculator || Object.values(bondInstances).length === 0) return { balance: 0 };

    const balances = await Promise.all(Object.keys(bondInstances).map(bondKey => bondInstances[bondKey].getTreasuryBalance(bondCalculator, TREASURY_ADDRESS)));

    const keys = Object.keys(bondInstances);

    return balances.reduce((acc, val, i) => {
        return {
            ...acc,
            [keys[i]]: val,
        };
    }, {});
});

export const calcBondDetails = createAsyncThunk('bonds/calcBondDetails', async ({ bondID, value }: { bondID: string; value: number }, { getState, dispatch }) => {
    const { bonds, main, markets } = getState() as RootState;

    const bondInstance = bonds.bondInstances[bondID];
    const bondMetrics = bonds.bondMetrics[bondID];

    if (!bondInstance || !bondMetrics || !bondInstance.getBondContract()) throw new Error('error init');

    const terms = await bondInstance.getBondContract().terms();
    const maxBondPrice = await bondInstance.getBondContract().maxPayout();
    const bondAmountInWei = utils.parseEther(value.toString());

    const reserves = main.metrics.reserves;
    const { bondCalculator } = bonds;
    const daiPrice = markets.markets.dai;

    if (!reserves || !daiPrice || !bondCalculator) throw new Error('No Reserves ');

    const marketPrice = reserves.div(10 ** 9).toNumber() * daiPrice;
    const baseBondPrice = (await bondInstance.getBondContract().bondPriceInUSD()) as BigNumber;
    const bondPrice = bondInstance.isCustomBond() ? baseBondPrice.mul(daiPrice) : baseBondPrice;

    // = (reserve - bondPrice) / bondPrice
    const bondDiscount = reserves
        .mul(10 ** 9)
        .sub(bondPrice)
        .div(bondPrice)
        .toNumber();

    const { bondQuote, maxBondPriceToken } = bondInstance.isLP()
        ? await getLPBondQuote(bondInstance, bondAmountInWei, bondCalculator, maxBondPrice)
        : await getTokenBondQuote(bondInstance, bondAmountInWei, maxBondPrice);

    if (!!value && bondQuote > maxBondPrice) {
        dispatch(addNotification({ severity: 'error', description: messages.try_mint_more(maxBondPrice.toFixed(2).toString()) }));
    }

    // let purchased = (await reverseContract.balanceOf(TREASURY_ADDRESS)).toNumber() as number;
    const initialPurchased = 0;

    const { purchased } = bondInstance.isLP()
        ? await getLPPurchasedBonds(bondInstance, bondCalculator, initialPurchased, daiPrice)
        : await getTokenPurchaseBonds(bondInstance, bondCalculator, initialPurchased, daiPrice);

    return {
        bondID: bondID,
        bondDiscount,
        bondQuote,
        purchased,
        vestingTerm: Number(terms.vestingTerm), // Number(terms.vestingTerm),
        maxBondPrice: maxBondPrice / 10 ** 9,
        bondPrice, // bondPrice / Math.pow(10, 18),
        marketPrice,
        maxBondPriceToken,
    };
});

export const getBondTerms = createAsyncThunk('bonds/terms', async (bondID: string, { getState }) => {
    const {
        bonds: { bondInstances },
    } = getState() as RootState;

    if (bondInstances[bondID] === undefined) throw new Error('Bond not found');

    const terms = await bondInstances[bondID].getBondContract().terms();

    return { terms };
});

export const approveBonds = createAsyncThunk('bonds/approve', async ({ signer, bondID }: { signer: providers.Web3Provider; bondID: string }, { dispatch, getState }) => {
    if (!signer) {
        dispatch(walletConnectWarning);
        return;
    }

    const {
        bonds: { bondInstances },
    } = getState() as RootState;

    const bond = bondInstances[bondID];

    if (!bond) throw new Error('Bond not found');

    const address = await signer.getSigner().getAddress();
    const gasPrice = await signer.getGasPrice();

    const { bondAddress } = bond.getBondAddresses();
    const approveTx = await bond.getReserveContract().approve(bondAddress, constants.MaxUint256, { gasPrice });
    try {
        dispatch(
            addPendingTransaction({
                hash: approveTx.hash,
                type: TransactionTypeEnum.APPROVE_CONTRACT,
            }),
        );
        await approveTx.wait();

        dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
    } catch (err) {
        console.error(err);
        metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTransaction(TransactionTypeEnum.APPROVE_CONTRACT));
        }
    }

    const allowance = await bond.getReserveContract().allowance(address, bondAddress);

    return { allowance };
});

export const calculateUserBondDetails = createAsyncThunk(
    'bonds/calculateUserBondDetails',
    async ({ signerAddress, signer, bondID }: { signer: providers.Web3Provider; signerAddress: string; bondID: string }, { getState, dispatch }) => {
        const {
            main: {
                blockchain: { timestamp },
            },
            bonds: { bondInstances },
        } = getState() as IReduxState;

        const bond = bondInstances[bondID];

        if (!bond) throw new Error('Unable to quote');

        dispatch(getBlockchainData(signer)); // needed to result the timestamp

        const bondContract = bond.getBondContract();
        const userAddress = signerAddress;

        const { payout, vesting, lastTime } = await bondContract.bondInfo(userAddress);
        const interestDue = payout / Math.pow(10, 9);
        const bondMaturationBlock = Number(vesting) + Number(lastTime);
        const pendingPayout = await bondContract.pendingPayoutFor(userAddress);

        const pendingPayoutVal = utils.formatUnits(pendingPayout, 'gwei');

        return {
            interestDue,
            bondMaturationBlock,
            bondVesting: bondMaturationBlock - (timestamp ?? 0),
            pendingPayout: Number(pendingPayoutVal),
        };
    },
);

export const depositBond = createAsyncThunk(
    'bonds/deposit',
    async (
        { amount, bondID, signer, signerAddress, slippage }: { amount: number; bondID: string; signer: providers.Web3Provider; signerAddress: string; slippage?: number },
        { dispatch, getState },
    ) => {
        const { bonds } = getState() as RootState;

        const bondInstance = bonds.bondInstances[bondID];
        const bondMetrics = bonds.bondMetrics[bondID];

        if (!bondInstance || !bondMetrics) throw new Error('Unable to get bonds');

        const address = signerAddress;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const acceptedSlippage = (slippage ?? 0.5) / 100 || 0.005;
        const valueInWei = utils.parseUnits(amount.toString(), 'ether');
        const bondContract = bondInstance.getBondContract();

        if (!bondMetrics.bondPrice) throw new Error('Unable to get bondPrice');

        const gasPrice = await signer.getGasPrice();

        let bondTx;

        console.log('Deposit', valueInWei, address, gasPrice);
        console.log('Contract', bondContract.address);

        bondContract.on('error', err => {
            console.log('Here the error', JSON.stringify(err));
        });

        try {
            const bondPremium = await bondInstance.getBondContract().bondPrice();
            const premium = Math.round(bondPremium.toNumber()); // TODO: use acceptedSlippage
            const gasEstimation = await bondContract.estimateGas.deposit(valueInWei, 8040, address);

            bondTx = await bondContract.deposit(valueInWei, premium, address, { gasPrice, gasLimit: gasEstimation });
            dispatch(
                addPendingTransaction({
                    hash: bondTx.hash,
                    type: TransactionTypeEnum.BONDING,
                }),
            );

            await bondTx.wait();
            dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
            dispatch(addNotification({ severity: 'info', description: messages.your_balance_update_soon }));

            await dispatch(calculateUserBondDetails({ bondID, signer, signerAddress }));

            dispatch(addNotification({ severity: 'info', description: messages.your_balance_updated }));
        } catch (err: unknown) {
            console.error('catching', err);
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (bondTx) {
                dispatch(clearPendingTransaction(TransactionTypeEnum.BONDING));
            }
        }
    },
);

export const loadBondBalancesAndAllowances = createAsyncThunk('bonds/balances-and-allowances', async ({ address, bondID }: { address: string; bondID: string }, { getState }) => {
    const {
        bonds: { bondInstances },
    } = getState() as IReduxState;

    const bond = bondInstances[bondID];
    if (!bond) throw new Error('Bond ');

    const bondContract = bond.getBondContract();
    const reserveContract = bond.getReserveContract();

    const allowance = await reserveContract.allowance(address, bondContract.address);
    const balance = await reserveContract.balanceOf(address);

    return { allowance, balance, ID: bond.ID };
});
