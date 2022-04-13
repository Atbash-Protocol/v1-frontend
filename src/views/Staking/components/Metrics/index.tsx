import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { formatAPY, formatNumber, formatUSD } from "helpers/price-units";
import { t } from "i18next";
import { memo } from "react";
import { useSelector } from "react-redux";
import { selectFormattedBashBalance } from "store/modules/markets/markets.selectors";
import { selectStakingRewards, selectTVL } from "store/modules/metrics/metrics.selectors";
import { selectFormattedIndex } from "store/modules/stake/stake.selectors";

function StakeMetrics() {
    const stakingMetrics = useSelector(selectStakingRewards);
    const TVL = useSelector(selectTVL);
    const BASHPrice = useSelector(selectFormattedBashBalance);
    const currentIndex = useSelector(selectFormattedIndex);

    if (!stakingMetrics || !TVL) return <Skeleton />;

    const metrics = [
        { key: "APY", value: `${formatAPY(stakingMetrics.stakingAPY.toString())} %` },
        { key: "TVL", value: formatUSD(TVL) },
        { key: "CurrentIndex", value: currentIndex },
        { key: "BASHPrice", value: BASHPrice },
    ].map(({ key, value }) => (
        <Grid xs={6} sm={4} md={4} lg={3} mt={2}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    {t(key)}
                </Typography>
                <Typography variant="body1" sx={{ overflow: "hidden", wordBreak: "break-all", overflowX: "hidden", color: theme.palette.secondary.main }}>
                    {!value ? <Skeleton /> : <>{value}</>}
                </Typography>
            </Box>
        </Grid>
    ));

    return (
        <Grid container spacing={2}>
            {metrics}
        </Grid>
    );
}

const memoStakeMetrics = memo(StakeMetrics);

export default memoStakeMetrics;
