import { ethers } from "ethers";
import { getAddressesAsync } from "../../constants";
import { StakingContract, SBashTokenContract, BashTokenContract, RedeemContract, PresaleContract, AbashContract } from "../../abi";
import { setAll, getMarketPrice, getTokenPrice } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";
import { ArrowBackSharp } from "@material-ui/icons";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async ({ networkID, provider }: ILoadAppDetails) => {
    const daiPrice = getTokenPrice("DAI");
    // const addresses = getAddresses(networkID);
    const addresses = await getAddressesAsync(networkID);

    // const ohmPrice = getTokenPrice("OHM");
    // const ohmAmount = 1512.12854088 * ohmPrice;
    // const presaleContract = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleContract, provider);
    const abashContract = new ethers.Contract(addresses.ABASH_ADDRESS, AbashContract, provider);
    const redeemableAbash = (await abashContract.totalSupply())
        .sub(await abashContract.balanceOf(addresses.PRESALE_ADDRESS))
        .sub(await abashContract.balanceOf(addresses.PRESALE_REDEMPTION_ADDRESS));

    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    // disable: const redeemContract = new ethers.Contract(addresses.REDEEM_ADDRESS, RedeemContract, provider);
    const sBASHContract = new ethers.Contract(addresses.SBASH_ADDRESS, SBashTokenContract, provider);
    const BASHContract = new ethers.Contract(addresses.BASH_ADDRESS, BashTokenContract, provider);
    const DAIContract = new ethers.Contract(addresses.DAI_ADDRESS, BashTokenContract, provider);

    const redeemableBash = (await BASHContract.balanceOf(addresses.PRESALE_REDEMPTION_ADDRESS)) / Math.pow(10, 9);

    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * daiPrice;

    const totalSupply = (await BASHContract.totalSupply()) / Math.pow(10, 9);
    const circSupply = (await sBASHContract.circulatingSupply()) / Math.pow(10, 9);

    // Total value locked - dollar amount of all staked Bash
    const stakingTVL = circSupply * marketPrice;
    const marketCap = totalSupply * marketPrice;

    const redeemRfv = 0; // (await redeemContract.RFV()) / Math.pow(10, 9);
    const redeemSbSent = 0; // (await sbContract.balanceOf(addresses.REDEEM_ADDRESS)) / Math.pow(10, 9);
    const redeemMimAvailable = 0; // (await DAIContract.balanceOf(addresses.REDEEM_ADDRESS)) / Math.pow(10, 18);

    const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider)); // get the balances of reserves in treasury
    const tokenBalances = await Promise.all(tokenBalPromises);
    const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1); // + redeemMimAvailable + 16176498; // add all balances + redeemable DAI + ?

    // dead-code: const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
    // dead-code: const tokenAmounts = await Promise.all(tokenAmountsPromises);

    // the amount of stable funds backing bash
    const rfvTreasury = tokenBalances[0] + tokenBalances[1] / 2; // tokenBalances[0] + tokenBalances[1] + redeemMimAvailable + tokenBalances[2] / 2 + tokenBalances[3] / 2 + 16176498;

    // get bash held in DAO
    const daoBash = await BASHContract.balanceOf(addresses.DAO_ADDRESS);
    const daoBashAmount = Number(ethers.utils.formatUnits(daoBash, "gwei"));

    // Determine total amount of bash in bonds
    const bashBondsAmountsPromises = allBonds.filter(bond => bond.name !== "bash_dai_minting").map(bond => bond.getBashAmount(networkID, provider));
    const bashBondsAmounts = await Promise.all(bashBondsAmountsPromises);

    const LpBashAmount = bashBondsAmounts.reduce((bashAmount0, bashAmount1) => bashAmount0 + bashAmount1, 0);
    const bashSupply = totalSupply - LpBashAmount - daoBashAmount - redeemableBash; // todo: should this include redeemable?

    const rfv = rfvTreasury / bashSupply; // rfvTreasury / (sbSupply - redeemSbSent); // qty of bash treasury can afford to pay out to stakers

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute; // the amount of BASH to distribute in the coming epoch
    const circ = await sBASHContract.circulatingSupply(); // available sBASH not held by staking contract
    const stakingRebase = stakingReward / circ; // rewardYield rate for this epoch
    const epochsPerDay = 3;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * epochsPerDay) - 1; // 3 epoch/day
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * epochsPerDay) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime;

    const treasuryRunway = rfvTreasury / circSupply;
    const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

    const deltaMarketPriceRfv = ((rfv - marketPrice) / rfv) * 100;

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
        deltaMarketPriceRfv: deltaMarketPriceRfv,
        currentBlockTime,
        nextRebase,
        rfv: rfv,
        runway,
        redeemRfv,
        redeemSbSent,
        redeemMimAvailable,
        redeemableAbash: Number(ethers.utils.formatUnits(redeemableAbash, 18)),
    };
});

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
    redeemableAbash: number;
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
