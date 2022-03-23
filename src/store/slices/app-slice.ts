import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract, MemoTokenContract, TimeTokenContract, RedeemContract } from "../../abi";
import { setAll, getMarketPrice, getTokenPrice } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const daiPrice = getTokenPrice("DAI");
        const addresses = getAddresses(networkID);

        // const ohmPrice = getTokenPrice("OHM");
        // const ohmAmount = 1512.12854088 * ohmPrice;

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const redeemContract = new ethers.Contract(addresses.REDEEM_ADDRESS, RedeemContract, provider);
        console.log(redeemContract);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const sBASHContract = new ethers.Contract(addresses.SBASH_ADDRESS, MemoTokenContract, provider);
        const BASHContract = new ethers.Contract(addresses.BASH_ADDRESS, TimeTokenContract, provider);
        const DAIContract = new ethers.Contract(addresses.DAI_ADDRESS, TimeTokenContract, provider); // todo: DAI

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * daiPrice;

        const totalSupply = (await BASHContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await sBASHContract.circulatingSupply()) / Math.pow(10, 9);

        // Total value locked - dollar amount of all staked Bash
        const stakingTVL = circSupply * marketPrice;
        const marketCap = totalSupply * marketPrice;

        const redeemRfv = 0; // (await redeemContract.RFV()) / Math.pow(10, 9);
        // try {
        //     await redeemContract.RFV();
        // } catch (e) {
        //     console.error(e);
        // }
        const redeemSbSent = 0; // (await sbContract.balanceOf(addresses.REDEEM_ADDRESS)) / Math.pow(10, 9);
        const redeemMimAvailable = 0; // (await DAIContract.balanceOf(addresses.REDEEM_ADDRESS)) / Math.pow(10, 18);

        // const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider)); // get the balances of reserves in treasury
        // const tokenBalances = await Promise.all(tokenBalPromises);
        const treasuryBalance = 0; // tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1) + redeemMimAvailable + 16176498; // add all balances + redeemable DAI + ?

        // const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
        // const tokenAmounts = await Promise.all(tokenAmountsPromises);

        const rfvTreasury = 0; // tokenBalances[0] + tokenBalances[1] + redeemMimAvailable + tokenBalances[2] / 2 + tokenBalances[3] / 2 + 16176498;

        const daoSb = await BASHContract.balanceOf(addresses.DAO_ADDRESS);
        const daoSbAmount = Number(ethers.utils.formatUnits(daoSb, "gwei"));

        const sbBondsAmountsPromises = allBonds.filter(bond => bond.name !== "bash_dai_minting").map(bond => bond.getSbAmount(networkID, provider));
        const sbBondsAmounts = await Promise.all(sbBondsAmountsPromises);

        const LpSbAmount = sbBondsAmounts.reduce((sbAmount0, sbAmount1) => sbAmount0 + sbAmount1, 0);
        const sbSupply = totalSupply - LpSbAmount - daoSbAmount;

        const rfv = 0; // rfvTreasury / (sbSupply - redeemSbSent);
        const deltaMarketPriceRfv = ((rfv - marketPrice) / rfv) * 100;

        // Calculating staking
        // const epoch = await stakingContract.epoch();
        // const secondsToEpoch = Number(await stakingContract.secondsToNextEpoch());
        // const stakingReward = epoch.distribute;
        // const circ = await sohmMainContract.circulatingSupply();
        // const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
        // const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        // const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const epoch = await stakingContract.epoch();
        const stakingReward = epoch.distribute; // the amount of BASH to distribute in the coming epoch
        const circ = await sBASHContract.circulatingSupply(); // available sBASH not held by staking contract
        const stakingRebase = stakingReward / circ; // rewardYield rate for this epoch
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1; // 3 epoch/day
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const currentIndex = await stakingContract.index();
        const nextRebase = epoch.endTime;

        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")), // in sBASH.decimals 9
            totalSupply,
            marketCap,
            currentBlock,
            circSupply,
            fiveDayRate,
            treasuryBalance,
            stakingAPY,
            stakingTVL,
            stakingRebase,
            marketPrice,
            deltaMarketPriceRfv,
            currentBlockTime,
            nextRebase,
            rfv,
            runway,
            redeemRfv,
            redeemSbSent,
            redeemMimAvailable,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    stakingTVL: number;
    marketPrice: number;
    deltaMarketPriceRfv: number;
    marketCap: number;
    circSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    stakingAPY: number;
    stakingRebase: number;
    networkID: number;
    nextRebase: number;
    totalSupply: number;
    rfv: number;
    runway: number;
    redeemRfv: number;
    redeemSbSent: number;
    redeemMimAvailable: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
