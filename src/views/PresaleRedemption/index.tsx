import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Link } from "@material-ui/core";
import { trim } from "../../helpers";
import { changeRedeem, changeRedeemApproval } from "../../store/slices/redeem-thunk";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";
import { IAppSlice, loadAppDetails } from "../../store/slices/app-slice";

import { useTranslation } from "react-i18next";

import "./presale-redemption.scss";

function PresaleRedemption() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const BashBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.BASH;
    });
    const abashBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.aBash;
    });
    const redeemAllowance = useSelector<IReduxState, number>(state => {
        return state.account.redeeming?.aBash;
    });
    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });
    const redeemableAbash = useSelector<IReduxState, number>(state => {
        return state.app.redeemableAbash;
    });

    const setMax = () => {
        setQuantity(abashBalance);
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeRedeemApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeRedeem = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_redeem }));
        } else {
            await dispatch(changeRedeem({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
            let loadProvider = provider;
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        }
    };

    const hasAllowance = useCallback(
        token => {
            return redeemAllowance;
        },
        [redeemAllowance],
    );

    const userRedeemableAbash = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 8,
        minimumFractionDigits: 2,
    }).format(Number(abashBalance));

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">{t("redeem:RedeemTitle")}</p>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>{t("ConnectWallet")}</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">{t("redeem:ConnectYourWalletToStake")}</p>
                                </div>
                            )}
                            {address && (
                                <>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder={t("Amount")}
                                                className="stake-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="stake-card-action-input-btn">
                                                            <p>{t("Max")}</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            <div className="stake-card-tab-panel">
                                                {address && hasAllowance("aBash") ? (
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "redeem")) return;
                                                            onChangeRedeem("redeem");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "redeeming", t("redeem:Redeem"))}</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "approve_redeem")) return;
                                                            onSeekApproval("aBash");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "approve_redeem", t("Approve"))}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="stake-card-action-help-text">{address && !hasAllowance("aBash") && <p>{t("redeem:ApproveNote")}</p>}</div>
                                    </div>

                                    <div className="stake-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Your Abash avaialble to Redeem</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{userRedeemableAbash}</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Your BASH Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(BashBalance), 4)} BASH</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">{t("Total Presale Still Redeemable")}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{redeemableAbash}</>}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default PresaleRedemption;
