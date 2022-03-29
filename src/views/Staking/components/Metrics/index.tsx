import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { formatAPY, formatNumber, formatUSD } from "helpers/price-units";
import { trim } from "helpers/trim";
import { t } from "i18next";
import { memo, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { IAppSlice } from "store/slices/app-slice";
import { IReduxState } from "store/slices/state.interface";

function StakeMetrics() {
    const { loading: isAppLoading, currentIndex, stakingAPY, stakingTVL, marketPrice } = useSelector<IReduxState, Partial<IAppSlice>>(state => state.app, shallowEqual);

    const trimmedStakingAPY = formatAPY(trim(stakingAPY ?? 0 * 100, 1));

    const metrics = [
        { key: "APY", value: ` ${trimmedStakingAPY} %` },
        { key: "TVL", value: formatUSD(Number(stakingTVL)) },
        { key: "CurrentIndex", value: `${formatNumber(Number(currentIndex), 2)} BASH` },
        { key: "BASHPrice", value: formatNumber(marketPrice) },
    ].map(({ key, value }) => (
        <Grid xs={6} sm={4} md={4} lg={3} mt={2}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    {t(key)}
                </Typography>
                <Typography variant="body1" sx={{ overflow: "hidden", wordBreak: "break-all", overflowX: "hidden", color: theme.palette.secondary.main }}>
                    {isAppLoading ? <Skeleton /> : <>{value}</>}
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

export default StakeMetrics;
