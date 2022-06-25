import { ethers } from "ethers";
import { getAddressesAsync } from "../../constants";
import { BashTokenContract, PresaleRedemptionContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

import i18n from "../../i18n";

interface IChangeRedeemApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeRedeemApproval = createAsyncThunk("redeem/changeRedeemApproval", async ({ token, provider, address, networkID }: IChangeRedeemApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = await getAddressesAsync(networkID);

    const signer = provider.getSigner(address);
    const abashContract = new ethers.Contract(addresses.ABASH_ADDRESS, BashTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "aBash") {
            approveTx = await abashContract.approve(addresses.PRESALE_REDEMPTION_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = i18n.t("redeem:ApproveRedeeming");
        const pendingTxnType = "approve_redeem";

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

    const aBashRedeemAllowance = await abashContract.allowance(address, addresses.PRESALE_REDEMPTION_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            redeeming: {
                aBash: Number(aBashRedeemAllowance),
            },
        }),
    );
});

interface IChangeRedeem {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeRedeem = createAsyncThunk("redeem/changeRedeem", async ({ action, value, provider, address, networkID }: IChangeRedeem, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = await getAddressesAsync(networkID);
    const signer = provider.getSigner(address);
    const redeem = new ethers.Contract(addresses.PRESALE_REDEMPTION_ADDRESS, PresaleRedemptionContract, signer);

    let redeemTx;

    try {
        const gasPrice = await getGasPrice(provider);

        redeemTx = await redeem.redeem(ethers.utils.parseUnits(value), { gasPrice });
        const pendingTxnType = i18n.t("redeem:Redeem");
        dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await redeemTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (redeemTx) {
            dispatch(clearPendingTxn(redeemTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
