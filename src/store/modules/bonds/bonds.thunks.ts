import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers, constants, ethers } from 'ethers';
import { sum, snakeCase } from 'lodash';

import { BondingCalcContract } from 'abi';
import { BONDS } from 'config/bonds';
import { getAddresses } from 'constants/addresses';
import { messages } from 'constants/messages';
import { WEB3State } from 'contexts/web3/web3.types';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import i18n from 'i18n';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { createBond, getBondContractsAddresses } from 'lib/bonds/bonds.helper';
import { error, info, success, warning } from 'store/slices/messages-slice';
import { clearPendingTxn, fetchPendingTxns } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import { getBlockchainData } from '../app/app.thunks';
import { initDefaultBondMetrics } from './bonds.helper';
import { BondItem, BondSlice } from './bonds.types';
import { getLPBondQuote, getLPPurchasedBonds, getTokenBondQuote, getTokenPurchaseBonds } from './bonds.utils';

export const initializeBonds = createAsyncThunk(
    'app/bonds',
    async (provider: WEB3State['provider'] | WEB3State['signer']): Promise<Pick<BondSlice, 'bonds' | 'bondCalculator'>> => {
        if (!provider) throw new Error('Bond initialization error');

        const signer = provider.getSigner();
        const chainID = await signer.getChainId();

        // init bond calculator
        const { BASH_BONDING_CALC_ADDRESS } = getAddresses(chainID);

        const bondCalculator = new ethers.Contract(BASH_BONDING_CALC_ADDRESS, BondingCalcContract, signer);

        const bondstoOutput = BONDS.reduce((acc, bondConfig) => {
            const bondInstance = createBond({ ...bondConfig, networkID: chainID });

            const contracts = getBondContractsAddresses(bondConfig, chainID);

            bondInstance.initializeContracts(contracts, signer);

            return {
                ...acc,
                [snakeCase(bondConfig.name)]: {
                    bondInstance,
                    metrics: initDefaultBondMetrics(),
                    terms: { vestingTerm: '' },
                },
            };
        }, {} as BondSlice['bonds']);

        return {
            bonds: bondstoOutput,
            bondCalculator,
        };
    },
);

export const getTreasuryBalance = createAsyncThunk('bonds/bonds-treasury', async (chainID: number, { getState }) => {
    const {
        bonds: { bonds, bondCalculator },
    } = getState() as IReduxState;

    const { TREASURY_ADDRESS } = getAddresses(chainID);

    if (!bondCalculator) return { balance: null };

    const balances = await Promise.all(Object.values(bonds).map(({ bondInstance }) => bondInstance.getTreasuryBalance(bondCalculator, TREASURY_ADDRESS)));

    return {
        balance: sum(balances),
    };
});

export const calcBondDetails = createAsyncThunk('bonds/calcBondDetails', async ({ bond, value }: { bond: LPBond | StableBond; value: number }, { getState, dispatch }) => {
    if (!bond.getBondContract()) throw new Error('error init');

    const state = getState() as IReduxState;

    const terms = await bond.getBondContract().terms();
    const maxBondPrice = await bond.getBondContract().maxPayout();
    const bondAmountInWei = ethers.utils.parseEther(value.toString());

    const reserves = state.main.metrics.reserves;
    const { bondCalculator } = state.bonds;
    const daiPrice = state.markets.markets.dai;

    if (!reserves || !daiPrice || !bondCalculator) throw new Error('CalcBondDetailsError');

    const marketPrice = reserves.div(10 ** 9).toNumber() * daiPrice;
    const baseBondPrice = (await bond.getBondContract().bondPriceInUSD()) as ethers.BigNumber;
    const bondPrice = bond.isCustomBond() ? baseBondPrice.mul(daiPrice) : baseBondPrice;

    // = (reserve - bondPrice) / bondPrice
    const bondDiscount = reserves
        .mul(10 ** 9)
        .sub(bondPrice)
        .div(bondPrice)
        .toNumber();

    const { bondQuote, maxBondPriceToken } = bond.isLP()
        ? await getLPBondQuote(bond, bondAmountInWei, bondCalculator, maxBondPrice)
        : await getTokenBondQuote(bond, bondAmountInWei, maxBondPrice);

    if (!!value && bondQuote > maxBondPrice) {
        dispatch(error({ text: messages.try_mint_more(maxBondPrice.toFixed(2).toString()) }));
    }

    // let purchased = (await reverseContract.balanceOf(TREASURY_ADDRESS)).toNumber() as number;
    const initialPurchased = 0;

    const { purchased } = bond.isLP()
        ? await getLPPurchasedBonds(bond, bondCalculator, initialPurchased, daiPrice)
        : await getTokenPurchaseBonds(bond, bondCalculator, initialPurchased, daiPrice);

    return {
        bondID: bond.ID,
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

export const getBondTerms = createAsyncThunk('bonds/terms', async (bond: BondItem) => {
    const terms = await bond.bondInstance.getBondContract().terms();

    return { terms };
});

export const approveBonds = createAsyncThunk('bonds/approve', async ({ signer, bond }: { signer: providers.Web3Provider; bond: BondItem }, { dispatch }) => {
    if (!signer) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const address = await signer.getSigner().getAddress();
    const gasPrice = await signer.getGasPrice();

    const { bondAddress } = bond.bondInstance.getBondAddresses();
    const approveTx = await bond.bondInstance.getReserveContract().approve(bondAddress, constants.MaxUint256, { gasPrice });
    try {
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text: i18n.t('bond:ApprovingBond', { bond: bond.bondInstance.bondOptions.displayName }),
                type: 'approve_' + bond.bondInstance.bondOptions.displayName,
            }),
        );
        await approveTx.wait();

        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err) {
        console.error(err);
        metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    const allowance = await bond.bondInstance.getReserveContract().allowance(address, bondAddress);

    return { allowance };
});

export const calculateUserBondDetails = createAsyncThunk(
    'bonds/calculateUserBondDetails',
    async ({ signerAddress, signer, bond }: { signer: providers.Web3Provider; signerAddress: string; bond: BondItem }, { getState, dispatch }) => {
        const {
            main: {
                blockchain: { timestamp },
            },
        } = getState() as IReduxState;

        dispatch(getBlockchainData(signer)); // needed to result the timestamp

        const bondContract = bond.bondInstance.getBondContract();
        const userAddress = signerAddress;

        const { payout, vesting, lastTime } = await bondContract.bondInfo(userAddress);
        const interestDue = payout / Math.pow(10, 9);
        const bondMaturationBlock = Number(vesting) + Number(lastTime);
        const pendingPayout = await bondContract.pendingPayoutFor(userAddress);

        const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, 'gwei');

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
        { amount, bond, signer, signerAddress, slippage }: { amount: number; bond: BondItem; signer: providers.Web3Provider; signerAddress: string; slippage?: number },
        { dispatch },
    ) => {
        const address = signerAddress;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const acceptedSlippage = (slippage ?? 0.5) / 100 || 0.005;
        const valueInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
        const bondContract = bond.bondInstance.getBondContract();

        if (!bond.metrics.bondPrice) throw new Error('Unable to get bondPrice');

        const gasPrice = await signer.getGasPrice();

        let bondTx;

        console.log('Deposit', valueInWei, address, gasPrice);
        console.log('Contract', bondContract.address);

        bondContract.on('error', err => {
            console.log('Here the error', JSON.stringify(err));
        });

        try {
            const bondPremium = await bond.bondInstance.getBondContract().bondPrice();
            const premium = Math.round(bondPremium.toNumber()); // TODO: use acceptedSlippage
            const gasEstimation = await bondContract.estimateGas.deposit(valueInWei, 8040, address);

            bondTx = await bondContract.deposit(valueInWei, premium, address, { gasPrice, gasLimit: gasEstimation });
            dispatch(
                fetchPendingTxns({
                    txnHash: bondTx.hash,
                    text: i18n.t('bond:BondingBond', { bond: bond.bondInstance.bondOptions.displayName }),
                    type: 'bond_' + bond.bondInstance.bondOptions.name,
                }),
            );

            await bondTx.wait();
            dispatch(success({ text: messages.tx_successfully_send }));
            dispatch(info({ text: messages.your_balance_update_soon }));

            await dispatch(calculateUserBondDetails({ bond, signer, signerAddress }));

            dispatch(info({ text: messages.your_balance_updated }));
        } catch (err: unknown) {
            console.error('catching', err);
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (bondTx) {
                dispatch(clearPendingTxn(bondTx.hash));
            }
        }
    },
);

export const loadBondBalancesAndAllowances = createAsyncThunk('account/balances-and-allowances/bonds', async ({ address }: { address: string }, { getState }) => {
    const { bonds } = getState() as IReduxState;

    const data = await Promise.all(
        Object.values(bonds.bonds).map(async bond => {
            const bondContract = bond.bondInstance.getBondContract();
            const reserveContract = bond.bondInstance.getReserveContract();

            const allowance = await reserveContract.allowance(address, bondContract.address);
            const balance = await reserveContract.balanceOf(address);

            return { allowance, balance, ID: bond.bondInstance.ID };
        }),
    );

    return data;
});
