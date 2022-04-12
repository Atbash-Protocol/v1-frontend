import { Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { formatNumber } from "helpers/price-units";
import { trim } from "helpers/trim";
import { t } from "i18next";
import { shallowEqual, useSelector } from "react-redux";
import { AccountSlice } from "store/modules/account/account.types";
import { calculateStakingRewards } from "store/modules/app/app.helpers";
import { MainSliceState } from "store/modules/app/app.types";
import { IReduxState } from "store/slices/state.interface";

const UserStakeMetrics = () => {
    const { loading: accountLoading, balances, stakingAllowance } = useSelector<IReduxState, AccountSlice>(state => state.accountNew, shallowEqual);
    const circSupply = useSelector<IReduxState, number>(state => state.main.metrics.circSupply ?? 0);
    const { index: stakingIndex, epoch } = useSelector<IReduxState, MainSliceState["staking"]>(state => state.main.staking, shallowEqual);

    const { fiveDayRate } = calculateStakingRewards(epoch, circSupply);

    const stakingRebase = (epoch?.distribute ?? 0) / (circSupply * Math.pow(10, 9));
    const stakingRebasePercentage = stakingRebase * 100;
    const nextRewardValue = (Number(stakingRebasePercentage) / 100) * balances.SBASH.toNumber();
    const effectiveNextRewardValue = trim(nextRewardValue + (stakingRebasePercentage / 100) * balances.WSBASH.toNumber() * (stakingIndex || 0), 6);

    const keyMetrics = [
        { key: "YourBalance", value: `${trim(Number(balances.BASH), 4)} BASH` },
        { key: "stake:YourStakedBalance", value: `${trim(Number(balances.SBASH), 4)} sBASH` },
        { key: "stake:YourWrappedStakedBalance", value: `${balances.WSBASH} wsBASH` },
        { key: "stake:WrappedTokenEquivalent", value: `${trim(balances.WSBASH.toNumber() * (stakingIndex ?? 0), 6)} sBASH` },
        { key: "stake:NextRewardAmount", value: `${trim(nextRewardValue, 6)} BASH` },
        { key: "stake:NextRewardYield", value: `${formatNumber(stakingRebasePercentage, 2)} %` },
        { key: "stake:ROIFiveDayRate", value: `${trim(Number(fiveDayRate) * 100, 4)} %` },
    ];

    const optionalMetrics = [
        { key: "stake:YourWrappedStakedBalance", value: `${balances.WSBASH} wsBASH` },
        { key: "stake:WrappedTokenEquivalent", value: `${trim(balances.WSBASH.toNumber() * (stakingIndex ?? 0), 6)} sBASH` },
        { key: "stake:EffectiveNextRewardAmount", value: `${effectiveNextRewardValue} wsBASH` },
    ];

    const metrics = [...keyMetrics, ...(balances.WSBASH.toNumber() > 0 ? optionalMetrics : [])].map(({ key, value }) => (
        <div className="data-row">
            <p className="data-row-name">{t(key)}</p>
            <p className="data-row-value">{accountLoading ? <Skeleton /> : <>{value}</>}</p>
        </div>
    ));

    return (
        <div className="stake-user-data">
            <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
                Staking metrics
            </Typography>

            {metrics}
        </div>
    );
};

export default UserStakeMetrics;
