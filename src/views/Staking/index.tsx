import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { formatUSD, trim } from "../../helpers";
import { changeStake, changeApproval } from "../../store/slices/stake-thunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { IAppSlice } from "../../store/slices/app-slice";

import { useTranslation } from "react-i18next";
import { IAccountSlice } from "store/account/account.types";
import { UserBalance } from "./components/UserBalance";
import Stake from "./components/Stake";
import StakeMetrics from "./components/Metrics";

function Staking() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const currentIndex = useSelector<IReduxState, string>(state => {
        return state.app.currentIndex;
    });
    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });

    const { BASH, sBASH, wsBASH } = useSelector<IReduxState, IAccountSlice["balances"]>(state => state.account.balances);

    const { BASH: BASHbalance, sBASH: sBASHBalance, wsBASH: wsBASHBalance } = useSelector<IReduxState, IAccountSlice["balances"]>(state => state.account.balances);
    const { BASH: stakeAllowance, sBASH: unstakeAllowance } = useSelector<IReduxState, IAccountSlice["staking"]>(state => state.account.staking);
    const { stakingRebase, stakingAPY, stakingTVL } = useSelector<IReduxState, IAppSlice>(state => state.app);

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
    const effectiveNextRewardValue = trim(Number(Number(nextRewardValue) + (Number(stakingRebasePercentage) / 100) * Number(wrappedTokenEquivalent)), 6);

    const valueOfSB = formatUSD(Number(BASHbalance) * app.marketPrice);
    const valueOfStakedBalance = formatUSD(Number(trimmedsBASHBalance) * app.marketPrice);
    const valueOfWrappedStakedBalance = formatUSD(Number(trimmedWrappedStakedSBBalance) * Number(currentIndex) * app.marketPrice);
    const sumOfAllBalance = Number(BASHbalance) + Number(trimmedsBASHBalance) + Number(trimmedWrappedStakedSBBalance) * Number(currentIndex);
    const valueOfAllBalance = formatUSD(sumOfAllBalance * app.marketPrice);
    const valueOfYourNextRewardAmount = formatUSD(Number(nextRewardValue) * app.marketPrice);
    const valueOfYourEffectiveNextRewardAmount = formatUSD(Number(effectiveNextRewardValue) * app.marketPrice);

    /**
     * StakingAPY && trimmedStakingAPY
     * StakingAPY && stakingTVL
     * currentIndex
     * marketPrice
     *
     *
     *
     */
    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">{t("stake:StakeTitle")}</p>
                                <RebaseTimer />
                            </div>
                        </Grid>

                        <Grid item>
                            <StakeMetrics />
                        </Grid>

                        {/* <Stake /> */}
                    </Grid>
                </div>
            </Zoom>
            {/* {address && (
                <Zoom in={true}>
                    <div className="stake-card">
                        <Grid className="stake-card-grid" container direction="column">
                            <Grid item>
                                <div className="stake-card-header data-row">
                                    <p className="stake-card-header-title">{t("YourBalance")}</p>
                                    <p className="stake-card-header-title">{isAppLoading ? <Skeleton width="80px" /> : <>{valueOfAllBalance}</>}</p>
                                </div>
                            </Grid>

                            <div className="stake-card-area">
                                <>
                                    <div className="data-row">
                                        <p className="data-row-name">{t("stake:ValueOfYourBASH")}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfSB}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t("stake:ValueOfYourStakedBASH")}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfStakedBalance}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t("stake:ValueOfYourNextRewardAmount")}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourNextRewardAmount}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t("stake:ValueOfYourEffectiveNextRewardAmount")}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourEffectiveNextRewardAmount}</>}</p>
                                    </div>

                                    {Number(trimmedWrappedStakedSBBalance) > 0 && (
                                        <div className="data-row">
                                            <p className="data-row-name">{t("stake:ValueOfYourWrappedStakedSB")}</p>
                                            <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfWrappedStakedBalance}</>}</p>
                                        </div>
                                    )}
                                </>
                            </div>
                        </Grid>
                    </div>
                </Zoom>
            )}
            {address && <UserBalance />} */}
        </div>
    );
}

export default Staking;
