import { OutlinedInput, InputAdornment } from "@material-ui/core";
import { Skeleton, Tab, Tabs } from "@mui/material";
import classnames from "classnames";
import { messages } from "constants/messages";
import { formatUSD } from "helpers/price-units";
import { trim } from "helpers/trim";
import { useWeb3Context } from "hooks/web3";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { IAccountSlice } from "store/account/account.types";
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

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const currentIndex = useSelector<IReduxState, string>(state => {
        return state.app.currentIndex;
    });

    const { BASH: BASHbalance, sBASH: sBASHBalance, wsBASH: wsBASHBalance } = useSelector<IReduxState, IAccountSlice["balances"]>(state => state.account.balances);
    const { BASH: stakeAllowance, sBASH: unstakeAllowance } = useSelector<IReduxState, IAccountSlice["staking"]>(state => state.account.staking);
    const { stakingRebase, stakingAPY } = useSelector<IReduxState, IAppSlice>(state => state.app);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(BASHbalance);
        } else {
            setQuantity(sBASHBalance);
        }
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
        }
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "BASH") return stakeAllowance > 0;
            if (token === "sBASH") return unstakeAllowance > 0;
            return 0;
        },
        [stakeAllowance],
    );

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    // first card values
    const trimmedsBASHBalance = trim(Number(sBASHBalance), 6);
    const trimmedWrappedStakedSBBalance = trim(Number(wsBASHBalance), 6);
    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    console.log(`Trimmed StakingAPY: ${trimmedStakingAPY}`);
    const stakingRebasePercentage = trim(stakingRebase * 100, 4);
    const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedsBASHBalance), 6);
    const wrappedTokenEquivalent = trim(Number(trimmedWrappedStakedSBBalance) * Number(currentIndex), 6);

    const [value, setValue] = useState(2);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example">
        <Tab label="Active" />
        <Tab label="Disabled" disabled />
        <Tab label="Active" />
    </Tabs>;

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
            {/* {address && (
                <>
                    <div className="stake-card-action-area">
                        <div className="stake-card-action-stage-btns-wrap">
                            <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
                                <p>{t("stake:Stake")}</p>
                            </div>
                            <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
                                <p>{t("stake:Unstake")}</p>
                            </div>
                        </div>

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

                            {view === 0 && (
                                <div className="stake-card-tab-panel">
                                    {address && hasAllowance("BASH") ? (
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

                            {view === 1 && (
                                <div className="stake-card-tab-panel">
                                    {address && hasAllowance("sBASH") ? (
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

                        <div className="stake-card-action-help-text">
                            {address && ((!hasAllowance("BASH") && view === 0) || (!hasAllowance("sBASH") && view === 1)) && <p>{t("stake:ApproveNote")}</p>}
                        </div>
                    </div>
                    <UserStakeMetrics />
                </>
            )} */}
        </div>
    );
}

export default Stake;
