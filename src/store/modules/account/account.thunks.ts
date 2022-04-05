import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { IReduxState } from "store/slices/state.interface";

export const loadBalancesAndAllowances = createAsyncThunk("account/loadBalancesAndAllowances", async ({ networkID, provider, address }: any, { getState }): Promise<any> => {
    let BASHbalance = 0;
    let sBASHBalance = 0;
    let wsBASHBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let wrapAllowance = 0;
    let redeemAllowance = 0;

    const {
        main: {
            contracts: { BASH, SBASH_ADDRESS, STAKING_ADDRESS },
        },
    } = getState() as IReduxState;

    if (BASH) {
        BASHbalance = await BASH.balanceOf(address);
        try {
            stakeAllowance = await BASH.allowance(address, STAKING_ADDRESS);
        } catch (err) {
            console.log(err);
        }
        // disable: redeemAllowance = await sbContract.allowance(address, addresses.REDEEM_ADDRESS);
    }

    if (SBASH_ADDRESS) {
        sBASHBalance = await SBASH_ADDRESS.balanceOf(address);
        wrapAllowance = await SBASH_ADDRESS.allowance(address, SBASH_ADDRESS);
        unstakeAllowance = await SBASH_ADDRESS.allowance(address, STAKING_ADDRESS);
    }

    // if (addresses.WSBASH_ADDRESS) {
    //     const wsBASHContract = new ethers.Contract(addresses.WSBASH_ADDRESS, SBashTokenContract, provider);
    //     wsBASHBalance = await wsBASHContract.balanceOf(address);
    // }

    return {
        balances: {
            // wsBASH: ethers.utils.formatEther(wsBASHBalance),
            sBASH: ethers.utils.formatUnits(sBASHBalance, "gwei"),
            BASH: ethers.utils.formatUnits(BASHbalance, "gwei"),
        },

        stakingAllowance: {
            BASH: Number(stakeAllowance),
            sBASH: Number(unstakeAllowance),
        },
        // wrapping: {
        //     sBASHAllowance: Number(wrapAllowance),
        // },
    };
});
