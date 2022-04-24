import { StaticJsonRpcProvider, JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Networks } from "constants/blockchain";
import { messages } from "constants/messages";
import { PWeb3Context } from "contexts/web3/web3.context";
import { ethers } from "ethers";
import { getGasPrice } from "helpers/get-gas-price";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { sleep } from "helpers/sleep";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useContext } from "react";
import { getBalances } from "store/slices/account-slice";
import { warning, success, info } from "store/slices/messages-slice";
import { fetchPendingTxns, getStakingTypeText, clearPendingTxn, getPendingActionText } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";
import { loadBalancesAndAllowances } from "../account/account.thunks";
import { ChangeStakeOptions } from "./contracts.types";

export const stakeAction = createAsyncThunk("contracts/stake", async ({ action, amount }: ChangeStakeOptions, { dispatch, getState }) => {
    const { signer, signerAddress } = useSafeSigner();

    const {
        main: { contracts },
    } = getState() as IReduxState;

    const gasPrice = await getGasPrice(signer);

    const transaction =
        action === "STAKE"
            ? await contracts.STAKING_HELPER_ADDRESS!.stake(ethers.utils.parseUnits(amount.toString(), "gwei"), signerAddress, { gasPrice })
            : await contracts.STAKING_ADDRESS!.unstake(ethers.utils.parseUnits(amount.toString(), "gwei"), true, { gasPrice });

    try {
        dispatch(fetchPendingTxns({ txnHash: transaction.hash, text: getStakingTypeText(action), type: getPendingActionText(action) }));

        await transaction.wait();

        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        console.error(err);
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (transaction) {
            dispatch(clearPendingTxn(transaction.hash));
        }
    }

    dispatch(info({ text: messages.your_balance_update_soon }));

    await dispatch(loadBalancesAndAllowances(signerAddress));

    dispatch(info({ text: messages.your_balance_updated }));

    return;
});
