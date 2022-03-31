import { Skeleton, Typography } from "@mui/material";
import { trim } from "helpers/trim";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { IAccountSlice } from "store/account/account.types";
import { IAppSlice } from "store/slices/app-slice";
import { IPendingTxn } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";

const UserStakeMetrics = () => {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const currentIndex = useSelector<IReduxState, string>(state => {
        return state.app.currentIndex;
    });
    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });

    const { BASH: BASHbalance, sBASH: sBASHBalance, wsBASH: wsBASHBalance } = useSelector<IReduxState, IAccountSlice["balances"]>(state => state.account.balances);
    const { stakingRebase, stakingAPY } = useSelector<IReduxState, IAppSlice>(state => state.app);

    // first card values
    const trimmedsBASHBalance = trim(Number(sBASHBalance), 6);
    const trimmedWrappedStakedSBBalance = trim(Number(wsBASHBalance), 6);
    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const stakingRebasePercentage = trim(stakingRebase * 100, 4);
    const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedsBASHBalance), 6);
    const wrappedTokenEquivalent = trim(Number(trimmedWrappedStakedSBBalance) * Number(currentIndex), 6);
    const effectiveNextRewardValue = trim(Number(Number(nextRewardValue) + (Number(stakingRebasePercentage) / 100) * Number(wrappedTokenEquivalent)), 6);

    return (
        <div className="stake-user-data">
            <Typography> Staking metrics</Typography>

            <div className="data-row">
                <p className="data-row-name">{t("YourBalance")}</p>
                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(BASHbalance), 4)} BASH</>}</p>
            </div>

            <div className="data-row">
                <p className="data-row-name">{t("stake:YourStakedBalance")}</p>
                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedsBASHBalance} sBASH</>}</p>
            </div>

            {Number(trimmedWrappedStakedSBBalance) > 0 && (
                <div className="data-row">
                    <p className="data-row-name">{t("stake:YourWrappedStakedBalance")}</p>
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedWrappedStakedSBBalance} wsBASH</>}</p>
                </div>
            )}

            {Number(trimmedWrappedStakedSBBalance) > 0 && (
                <div className="data-row">
                    <p className="data-row-name">{t("stake:WrappedTokenEquivalent")}</p>
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>({wrappedTokenEquivalent} sBASH)</>}</p>
                </div>
            )}
            <div className="data-row">
                <p className="data-row-name">{t("stake:NextRewardAmount")}</p>
                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} BASH</>}</p>
            </div>

            {Number(trimmedWrappedStakedSBBalance) > 0 && (
                <div className="data-row">
                    <p className="data-row-name">{t("stake:EffectiveNextRewardAmount")}</p>
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{effectiveNextRewardValue} BASH</>}</p>
                </div>
            )}

            <div className="data-row">
                <p className="data-row-name">{t("stake:NextRewardYield")}</p>
                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</p>
            </div>

            <div className="data-row">
                <p className="data-row-name">{t("stake:ROIFiveDayRate")}</p>
                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}</p>
            </div>
        </div>
    );
};

export default UserStakeMetrics;
