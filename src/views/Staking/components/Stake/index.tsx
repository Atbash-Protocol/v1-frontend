import { OutlinedInput, InputAdornment } from "@material-ui/core";
import { Skeleton, Tab, Tabs } from "@mui/material";
import classnames from "classnames";
import { messages } from "constants/messages";
import { formatUSD } from "helpers/price-units";
import { trim } from "helpers/trim";
import { useWeb3Context } from "hooks/web3";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IAccountSlice } from "store/account/account.types";
import { AccountSlice } from "store/modules/account/account.types";
import { MainSliceState } from "store/modules/app/app.types";
import { stakeAction } from "store/modules/contracts/contracts.thunks";
import { StakeActionEnum } from "store/modules/contracts/contracts.types";
import { approveContract } from "store/modules/stake/stake.thunks";
import { IAppSlice } from "store/slices/app-slice";
import { warning } from "store/slices/messages-slice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "store/slices/pending-txns-slice";
import { changeApproval, changeStake } from "store/slices/stake-thunk";
import { IReduxState } from "store/slices/state.interface";
import UserStakeMetrics from "./StakeMetrics";

function Stake() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState<number>(0);

    const { BASH: stakeAllowance, sBASH: unstakeAllowance } = useSelector<IReduxState, IAccountSlice["staking"]>(state => state.account.staking);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const onSeekApproval = async (token: string) => {
        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            // await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));

            await dispatch(stakeAction({ address, provider, action: StakeActionEnum.STAKE, value: quantity }));
            setQuantity(0);
        }
    };

    const [viewId, setViewId] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, view: number) => {
        setViewId(view);
    };

    const { stakingAllowance, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew);
    const setMax = () => {
        // dispatch(approveContract({ provider, target: "BASH" }));
        if (viewId === 0) {
            setQuantity(balances.BASH);
        } else {
            setQuantity(balances.SBASH);
        }
    };

    console.log("allows", stakingAllowance, balances);
    return (
        <div className="stake-card-area">
            {!address && (
                <div className="stake-card-wallet-notification">
                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                        <p>{t("ConnectWallet")}</p>
                    </div>
                    <p className="stake-card-wallet-desc-text">{t("stake:ConnectYourWalletToStake")}</p>
                </div>
            )}
            <Tabs value={viewId} onChange={handleTabChange} aria-label="disabled tabs example">
                <Tab label={t("stake:Stake")} />
                <Tab label={t("stake:Unstake")} />
            </Tabs>

            <div className="stake-card-action-area">
                <div className="stake-card-action-row">
                    <OutlinedInput
                        type="number"
                        placeholder={t("Amount")}
                        className="stake-card-action-input"
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        labelWidth={0}
                        endAdornment={
                            <InputAdornment position="end">
                                <div onClick={setMax} className="stake-card-action-input-btn">
                                    <p>{t("Max")}</p>
                                </div>
                            </InputAdornment>
                        }
                    />

                    {viewId === 0 && (
                        <div className="stake-card-tab-panel">
                            {stakingAllowance.BASH > 0 ? (
                                <div
                                    className="stake-card-tab-panel-btn"
                                    onClick={() => {
                                        if (isPendingTxn(pendingTransactions, "staking")) return;
                                        onChangeStake("stake");
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
                                </div>
                            ) : (
                                <div
                                    className="stake-card-tab-panel-btn"
                                    onClick={() => {
                                        if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                        onSeekApproval("BASH");
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {viewId === 1 && (
                        <div className="stake-card-tab-panel">
                            {address && stakingAllowance.SBASH > 0 ? (
                                <div
                                    className="stake-card-tab-panel-btn"
                                    onClick={() => {
                                        if (isPendingTxn(pendingTransactions, "unstaking")) return;
                                        onChangeStake("unstake");
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "unstaking", t("Unstake BASH"))}</p>
                                </div>
                            ) : (
                                <div
                                    className="stake-card-tab-panel-btn"
                                    onClick={() => {
                                        if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
                                        onSeekApproval("sBASH");
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "approve_unstaking", t("Approve"))}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* 
                        <div className="stake-card-action-help-text">
                            {address && ((!hasAllowance("BASH") && view === 0) || (!hasAllowance("sBASH") && view === 1)) && <p>{t("stake:ApproveNote")}</p>}
                        </div> */}
            </div>
            <UserStakeMetrics />
        </div>
    );
}

export default Stake;
