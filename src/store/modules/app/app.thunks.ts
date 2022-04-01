import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ERC20_DECIMALS } from "lib/contracts/contracts";
import { IReduxState } from "store/slices/state.interface";
import { RootState } from "store/store";

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
            contracts: { BASH, SBASH_ADDRESS, INITIAL_PAIR_ADDRESS },
        },
    } = getState() as RootState;

    const totalSupply = (await BASH!.totalSupply()) / 10 ** ERC20_DECIMALS;
    const circSupply = (await SBASH_ADDRESS!.circulatingSupply()) / Math.pow(10, ERC20_DECIMALS);
    const reserves = await INITIAL_PAIR_ADDRESS!.getReserves();

    console.log("reserves", reserves);

    const state = getState();

    return {
        totalSupply,
        circSupply,
        reserves: 0,
    };
});

export const getStakingMetrics = createAsyncThunk("app/stakingMetrics", async (_, { getState }) => {
    const {
        main: {
            contracts: { STAKING_ADDRESS },
        },
    } = getState() as IReduxState;

    const epoch = await STAKING_ADDRESS!.epoch();
    const secondsToNextEpoch = 0; // Number(await STAKING_ADDRESS.secondsToNextEpoch());
    // const secondsToNextEpoch = Number(await stakingContract.secondsToNextEpoch());

    const index = await STAKING_ADDRESS!.index();

    return {
        epoch,
        index,
        secondsToNextEpoch,
    };
});
