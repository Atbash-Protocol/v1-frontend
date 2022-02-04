import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { WrappingContract, TimeTokenContract, MemoTokenContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

import i18n from "../../i18n";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const sBASHContract = new ethers.Contract(addresses.SBASH_ADDRESS, MemoTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "sBASH") {
            approveTx = await sBASHContract.approve(addresses.WSBASH_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = token === "sBASH" ? i18n.t("wrap:ApproveWrapping") : "";
        const pendingTxnType = token === "sBASH" ? "approve_wrapping" : "";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const wrapAllowance = await sBASHContract.allowance(address, addresses.WSBASH_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            wrapping: {
                sbWrap: Number(wrapAllowance),
            },
        }),
    );
});

interface IChangeWrap {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeWrap = createAsyncThunk("stake/changeWrap", async ({ action, value, provider, address, networkID }: IChangeWrap, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const wsBASH = new ethers.Contract(addresses.WSBASH_ADDRESS, WrappingContract, signer);

    let wrapTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "wrap") {
            console.log(value);
            console.log(ethers.utils.parseEther(value));
            wrapTx = await wsBASH.wrap(ethers.utils.parseUnits(value, "gwei"), { gasPrice });
        } else {
            wrapTx = await wsBASH.unwrap(ethers.utils.parseEther(value), { gasPrice });
        }
        const pendingTxnType = action === "wrap" ? i18n.t("wrap:Wrapping") : i18n.t("wrap:Unwrapping");
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await wrapTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (wrapTx) {
            dispatch(clearPendingTxn(wrapTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
