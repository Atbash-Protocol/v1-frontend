import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { MemoTokenContract, TimeTokenContract } from "abi";
import { getAddresses } from "constants/addresses";
import { ethers } from "ethers";
import { IReduxState } from "store/slices/state.interface";

export const loadBalancesAndAllowances = createAsyncThunk("account/loadBalancesAndAllowances", async ({ chainID, provider, address }: any, { getState }): Promise<any> => {
    let BASHbalance = 0;
    let sBASHBalance = 0;
    let wsBASHBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let wrapAllowance = 0;
    let redeemAllowance = 0;

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
            WSBASH: ethers.utils.formatEther(wsBASHBalance),
            SBASH: ethers.utils.formatUnits(sBASHBalance, "gwei"),
            BASH: ethers.utils.formatUnits(BASHbalance, "gwei"),
        },

        stakingAllowance: {
            BASH: Number(stakeAllowance),
            SBASH: Number(unstakeAllowance),
        },
        // wrapping: {
        //     sBASHAllowance: Number(wrapAllowance),
        // },
    };
});
