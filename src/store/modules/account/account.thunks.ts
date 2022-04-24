import { createAsyncThunk } from "@reduxjs/toolkit";
import { PWeb3Context } from "contexts/web3/web3.context";
import { BigNumber, constants, Contract, ethers } from "ethers";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useContext } from "react";
import { successTransaction, walletConnectWarning, warning } from "store/slices/messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";
import { AccountSlice } from "./account.types";

export const loadBalancesAndAllowances = createAsyncThunk(
    "account/loadBalancesAndAllowances",
    async (address: string, { getState }): Promise<Pick<AccountSlice, "balances" | "stakingAllowance">> => {
        if (!address) throw new Error("Missing address");

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
            wrapAllowance = await SBASH_CONTRACT.allowance(address, WSBASH_ADDRESS?.address);
            stakeAllowance = await SBASH_CONTRACT.allowance(address, STAKING_ADDRESS?.address);
            unstakeAllowance = await SBASH_CONTRACT.balanceOf(address);
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

export const approveContract = createAsyncThunk(
    "account/approveContract",
    async ({ contract, amount, type }: { contract: Contract; type: string; amount?: BigNumber }, { getState, dispatch }) => {
        const {
            state: { signer, signerAddress },
        } = useContext(PWeb3Context);

        if (!signerAddress || !signer) throw new Error("Unable to get signerAddress");

        if (!signerAddress) {
            dispatch(walletConnectWarning);
            return;
        }

        let approveTx;
        try {
            const gasPrice = await signer.getGasPrice();

            approveTx = await contract.approve(signerAddress, amount ?? ethers.constants.MaxUint256, { gasPrice });

            // const text = token === "BASH" ? i18n.t("stake:ApproveStaking") : i18n.t("stake:ApproveUnstaking");
            // const pendingTxnType = token === "BASH" ? "approve_staking" : "approve_unstaking";
            const text = "some text";

            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type }));
            await approveTx.wait();
            dispatch(successTransaction);
        } catch (err: any) {
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (approveTx) {
                dispatch(clearPendingTxn(approveTx.hash));
            }
        }
    },
);

export const getContractAllowance = createAsyncThunk("account/allowance", async ({ contract, toAddress }: { contract: Contract; toAddress: string }, { dispatch }) => {
    const {
        state: { signer, signerAddress },
    } = useContext(PWeb3Context);

    if (!signerAddress || !signer) throw new Error("Unable to get signerAddress");

    if (!signerAddress) {
        dispatch(walletConnectWarning);
        return;
    }

    const allowance = await contract.allowance(toAddress, signerAddress);

    return allowance;
});
