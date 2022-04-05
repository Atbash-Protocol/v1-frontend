import { StaticJsonRpcProvider, JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Networks } from "constants/blockchain";
import { messages } from "constants/messages";
import { ethers } from "ethers";
import { getGasPrice } from "helpers/get-gas-price";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { sleep } from "helpers/sleep";
import { getBalances } from "store/slices/account-slice";
import { warning, success, info } from "store/slices/messages-slice";
import { fetchPendingTxns, getStakingTypeText, clearPendingTxn, getPendingActionText } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";
import { loadBalancesAndAllowances } from "../account/account.thunks";
import { ChangeStakeOptions } from "./contracts.types";

export const stakeAction = createAsyncThunk("contracts/stake", async ({ action, address, value, provider }: ChangeStakeOptions, { dispatch, getState }) => {
    const {
        main: { contracts },
    } = getState() as IReduxState;

    if (!provider || !contracts.STAKING_HELPER_ADDRESS) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const gasPrice = await getGasPrice(provider);

    const transaction =
        action === "STAKE"
            ? await contracts.STAKING_HELPER_ADDRESS!.stake(ethers.utils.parseUnits(value.toString(), "gwei"), address, { gasPrice })
            : await contracts.STAKING_ADDRESS!.unstake(ethers.utils.parseUnits(value.toString(), "gwei"), true, { gasPrice });

    console.log("tx", transaction);
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

    await dispatch(loadBalancesAndAllowances(address));

    dispatch(info({ text: messages.your_balance_updated }));

    return;
});
