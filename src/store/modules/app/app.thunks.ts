import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, Contract, ethers } from 'ethers';

import { LpReserveContract, MemoTokenContract, RedeemContract, StakingContract, StakingHelperContract, TimeTokenContract, ZapinContract } from 'abi';
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
            [ContractEnum.STAKING_ADDRESS]: new Contract(addresses.STAKING_ADDRESS, StakingContract, contractSignerOrProvider),
            [ContractEnum.STAKING_HELPER_ADDRESS]: new Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, contractSignerOrProvider),
            [ContractEnum.INITIAL_PAIR_ADDRESS]: new Contract(addresses.INITIAL_PAIR_ADDRESS, LpReserveContract, contractSignerOrProvider),
            [ContractEnum.REDEEM_ADDRESS]: new Contract(addresses.REDEEM_ADDRESS, RedeemContract, contractSignerOrProvider),
            [ContractEnum.SBASH_CONTRACT]: new Contract(addresses.SBASH_ADDRESS, MemoTokenContract, contractSignerOrProvider),
            [ContractEnum.BASH_CONTRACT]: new Contract(addresses.BASH_ADDRESS, TimeTokenContract, contractSignerOrProvider),
            [ContractEnum.DAI_ADDRESS]: new Contract(addresses.DAI_ADDRESS, TimeTokenContract, contractSignerOrProvider),
            [ContractEnum.WSBASH_ADDRESS]: new Contract(addresses.WSBASH_ADDRESS, MemoTokenContract, contractSignerOrProvider),
            [ContractEnum.ZAPIN_ADDRESS]: new Contract(addresses.WSBASH_ADDRESS, ZapinContract, contractSignerOrProvider),
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
            contracts: { BASH_CONTRACT, SBASH_CONTRACT, INITIAL_PAIR_ADDRESS },
        },
    } = getState() as RootState;

    if (!BASH_CONTRACT || !SBASH_CONTRACT || !INITIAL_PAIR_ADDRESS) throw new Error('Unable to get coreMetrics ');

    const totalSupply = (await BASH_CONTRACT.totalSupply()) / 10 ** ERC20_DECIMALS;
    const circSupply = (await SBASH_CONTRACT.circulatingSupply()) / Math.pow(10, ERC20_DECIMALS);
    const [reserve1, reserve2]: ethers.BigNumber[] = await INITIAL_PAIR_ADDRESS.getReserves();

    return {
        totalSupply,
        circSupply,
        reserves: reserve2.div(reserve1),
    };
});

export const getStakingMetrics = createAsyncThunk('app/stakingMetrics', async (_, { getState }) => {
    const {
        main: {
            contracts: { STAKING_ADDRESS },
        },
    } = getState() as IReduxState;

    if (!STAKING_ADDRESS) throw new Error('Unable to get staking address is this point');

    const epoch = await STAKING_ADDRESS.epoch();
    const secondsToNextEpoch = 0; // TODO: Number(await STAKING_ADDRESS!.secondsToNextEpoch()); not working on staking contract
    const index = await STAKING_ADDRESS.index();

    return {
        epoch: {
            distribute: epoch.distribute.toNumber(),
            endTime: epoch.endTime,
        },
        index: BigNumber.from(index).toNumber(),
        secondsToNextEpoch,
    };
});
