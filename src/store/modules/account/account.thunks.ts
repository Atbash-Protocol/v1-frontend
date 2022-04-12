import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { IReduxState } from "store/slices/state.interface";
import { AccountSlice } from "./account.types";

export const loadBalancesAndAllowances = createAsyncThunk(
    "account/loadBalancesAndAllowances",
    async ({ address }: any, { getState }): Promise<Pick<AccountSlice, "balances" | "stakingAllowance">> => {
        let BASHbalance = ethers.BigNumber.from(0);
        let sBASHBalance = ethers.BigNumber.from(0);
        let wsBASHBalance = ethers.BigNumber.from(0);
        let stakeAllowance = ethers.BigNumber.from(0);
        let unstakeAllowance = ethers.BigNumber.from(0);
        let wrapAllowance = ethers.BigNumber.from(0);
        let redeemAllowance = ethers.BigNumber.from(0);

        const {
            main: {
                contracts: { BASH_CONTRACT, SBASH_CONTRACT, STAKING_ADDRESS, STAKING_HELPER_ADDRESS, WSBASH_ADDRESS },
            },
        } = getState() as IReduxState;

        if (BASH_CONTRACT) {
            BASHbalance = await BASH_CONTRACT.balanceOf(address);
            stakeAllowance = await BASH_CONTRACT.allowance(address, STAKING_HELPER_ADDRESS?.address);
            // disable: redeemAllowance = await sbContract.allowance(address, addresses.REDEEM_ADDRESS);
        }

        if (SBASH_CONTRACT) {
            try {
                wrapAllowance = await SBASH_CONTRACT.allowance(address, WSBASH_ADDRESS?.address);
                unstakeAllowance = await SBASH_CONTRACT.allowance(address, STAKING_ADDRESS?.address);
                unstakeAllowance = await SBASH_CONTRACT.allowance(address, STAKING_ADDRESS?.address);
            } catch (err) {
                console.log(err);
            }
        }

        // if (addresses.WSBASH_ADDRESS) {
        //     const wsBASHContract = new ethers.Contract(addresses.WSBASH_ADDRESS, SBashTokenContract, provider);
        //     wsBASHBalance = await wsBASHContract.balanceOf(address);
        // }

        return {
            balances: {
                WSBASH: wsBASHBalance,
                SBASH: sBASHBalance,
                BASH: BASHbalance,
            },

            stakingAllowance: {
                BASH: stakeAllowance,
                SBASH: unstakeAllowance,
            },
            // wrapping: {
            //     sBASHAllowance: Number(wrapAllowance),
            // },
        };
    },
);
