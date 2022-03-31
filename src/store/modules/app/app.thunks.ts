import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ERC20_DECIMALS } from "lib/contracts/contracts";
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
    // const reserves = await INITIAL_PAIR_ADDRESS!.getReserves();
    const reserves = 100;

    const state = getState();

    return {
        totalSupply,
        circSupply,
        reserves,
    };
});
