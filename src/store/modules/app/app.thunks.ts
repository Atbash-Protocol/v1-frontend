import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { StakingContract, LpReserveContract, RedeemContract, MemoTokenContract, TimeTokenContract, StakingHelperContract, ZapinContract } from "abi";
import { getAddresses } from "constants/addresses";
import { BigNumber, Contract, ethers } from "ethers";
import { ERC20_DECIMALS } from "lib/contracts/contracts";
import { getSigner } from "lib/contracts/networks";
import { IReduxState } from "store/slices/state.interface";
import { RootState } from "store/store";
import { ContractEnum } from "./app.types";

export const initializeProviderContracts = createAsyncThunk(
    "app/contracts",
    async ({ networkID, provider }: { networkID: number; provider: JsonRpcProvider | Web3Provider }): Promise<{ [key in ContractEnum]: Contract }> => {
        const addresses = getAddresses(networkID);

        const signer = await getSigner(provider);

        return {
            [ContractEnum.STAKING_ADDRESS]: new Contract(addresses.STAKING_ADDRESS, StakingContract, signer),
            [ContractEnum.STAKING_HELPER_ADDRESS]: new Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer),
            [ContractEnum.INITIAL_PAIR_ADDRESS]: new Contract(addresses.INITIAL_PAIR_ADDRESS, LpReserveContract, signer),
            [ContractEnum.REDEEM_ADDRESS]: new Contract(addresses.REDEEM_ADDRESS, RedeemContract, signer),
            [ContractEnum.SBASH_CONTRACT]: new Contract(addresses.SBASH_ADDRESS, MemoTokenContract, signer),
            [ContractEnum.BASH_CONTRACT]: new Contract(addresses.BASH_ADDRESS, TimeTokenContract, signer),
            [ContractEnum.DAI_ADDRESS]: new Contract(addresses.DAI_ADDRESS, TimeTokenContract, signer),
            [ContractEnum.WSBASH_ADDRESS]: new Contract(addresses.WSBASH_ADDRESS, MemoTokenContract, signer),
            [ContractEnum.ZAPIN_ADDRESS]: new Contract(addresses.WSBASH_ADDRESS, ZapinContract, signer),
        };
    },
);

export const getBlockchainData = createAsyncThunk("app/blockchain", async (provider: JsonRpcProvider) => {
    const currentBlock = await provider.getBlockNumber();
    const { timestamp } = await provider.getBlock(currentBlock);

    return {
        currentBlock,
        timestamp,
    };
});

export const getCoreMetrics = createAsyncThunk("app/coreMetrics", async (_, { getState }) => {
    const {
        main: {
            contracts: { BASH_CONTRACT, SBASH_CONTRACT, INITIAL_PAIR_ADDRESS },
        },
    } = getState() as RootState;

    const totalSupply = (await BASH_CONTRACT!.totalSupply()) / 10 ** ERC20_DECIMALS;
    const circSupply = (await SBASH_CONTRACT!.circulatingSupply()) / Math.pow(10, ERC20_DECIMALS);
    const [reserve1, reserve2]: ethers.BigNumber[] = await INITIAL_PAIR_ADDRESS!.getReserves();

    return {
        totalSupply,
        circSupply,
        reserves: reserve2.div(reserve1),
    };
});

export const getStakingMetrics = createAsyncThunk("app/stakingMetrics", async (_, { getState }) => {
    const {
        main: {
            contracts: { STAKING_ADDRESS },
        },
    } = getState() as IReduxState;

    const epoch = await STAKING_ADDRESS!.epoch();
    const secondsToNextEpoch = 0; // TODO : Number(await STAKING_ADDRESS!.secondsToNextEpoch()); not working on staking contract
    const index = await STAKING_ADDRESS!.index();

    return {
        epoch: {
            distribute: epoch.distribute.toNumber(),
            endTime: epoch.endTime,
        },
        index: BigNumber.from(index).toNumber(),
        secondsToNextEpoch,
    };
});
