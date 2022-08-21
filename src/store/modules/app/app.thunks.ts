import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contract, ethers } from 'ethers';

import { LpReserveContract, MemoTokenContract, RedeemContract, StakingContract, StakingHelperContract, TimeTokenContract, WrappingContract, ZapinContract } from 'abi';
import { getAddresses } from 'constants/addresses';
import { WEB3State } from 'contexts/web3/web3.types';
import { ERC20_DECIMALS } from 'lib/contracts/contracts';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { ContractEnum } from './app.types';

export const initializeProviderContracts = createAsyncThunk(
    'app/contracts',
    async ({ provider, signer }: { provider?: WEB3State['provider']; signer?: WEB3State['signer'] }): Promise<{ [key in ContractEnum]: Contract }> => {
        if (!provider && !signer) throw new Error('No provider or signer');

        const chainID = (await (signer ?? provider)?.getNetwork())?.chainId;

        if (!chainID || typeof chainID !== 'number') throw new Error('Unable to initialize contracts');

        const addresses = getAddresses(chainID);
        const contractSignerOrProvider = signer ? await signer.getSigner() : await provider;

        if (!contractSignerOrProvider) throw new Error('Unable to get a contract signer or provider');

        return {
            [ContractEnum.STAKING_CONTRACT]: new Contract(addresses.STAKING_ADDRESS, StakingContract, contractSignerOrProvider),
            [ContractEnum.STAKING_HELPER_CONTRACT]: new Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, contractSignerOrProvider),
            [ContractEnum.BASH_DAI_LP_CONTRACT]: new Contract(addresses.BASH_DAI_LP_ADDRESS, LpReserveContract, contractSignerOrProvider),

            [ContractEnum.REDEEM_CONTRACT]: new Contract(addresses.REDEEM_ADDRESS, RedeemContract, contractSignerOrProvider),
            [ContractEnum.SBASH_CONTRACT]: new Contract(addresses.SBASH_ADDRESS, MemoTokenContract, contractSignerOrProvider),
            [ContractEnum.BASH_CONTRACT]: new Contract(addresses.BASH_ADDRESS, TimeTokenContract, contractSignerOrProvider),
            [ContractEnum.DAI_CONTRACT]: new Contract(addresses.DAI_ADDRESS, TimeTokenContract, contractSignerOrProvider),
            [ContractEnum.WSBASH_CONTRACT]: new Contract(addresses.WSBASH_ADDRESS, WrappingContract, contractSignerOrProvider),
            [ContractEnum.ZAPING_CONTRACT]: new Contract(addresses.WSBASH_ADDRESS, ZapinContract, contractSignerOrProvider),
        };
    },
);

export const getBlockchainData = createAsyncThunk('app/blockchain', async (provider: WEB3State['provider'] | WEB3State['signer']) => {
    if (!provider) throw new Error('Unable to find provider');

    const currentBlock = await provider.getBlockNumber();
    const { timestamp } = await provider.getBlock(currentBlock);

    return {
        currentBlock,
        timestamp,
    };
});

export const getCoreMetrics = createAsyncThunk('app/coreMetrics', async (_, { getState }) => {
    const {
        main: {
            contracts: { BASH_CONTRACT, SBASH_CONTRACT, BASH_DAI_LP_CONTRACT },
        },
    } = getState() as RootState;

    if (!BASH_CONTRACT || !SBASH_CONTRACT || !BASH_DAI_LP_CONTRACT) throw new Error('Unable to get coreMetrics');

    const rawCircSupply = await SBASH_CONTRACT.circulatingSupply();
    const totalSupply = (await BASH_CONTRACT.totalSupply()) / 10 ** ERC20_DECIMALS;
    const circSupply = rawCircSupply / Math.pow(10, ERC20_DECIMALS);

    const [reserve1, reserve2]: ethers.BigNumber[] = await BASH_DAI_LP_CONTRACT.getReserves();

    return {
        totalSupply,
        circSupply,
        rawCircSupply,
        reserves: reserve1.div(reserve2),
    };
});

export const getStakingMetrics = createAsyncThunk('app/stakingMetrics', async (_, { getState }) => {
    const {
        main: {
            contracts: { STAKING_CONTRACT },
        },
    } = getState() as IReduxState;

    if (!STAKING_CONTRACT) throw new Error('Unable to get staking contract');

    const epoch = await STAKING_CONTRACT.epoch();
    const secondsToNextEpoch = 0;
    const index = await STAKING_CONTRACT.index();

    return {
        epoch: {
            distribute: epoch.distribute,
            endTime: epoch.endTime,
            number: epoch.number,
        },
        index,
        secondsToNextEpoch,
    };
});
