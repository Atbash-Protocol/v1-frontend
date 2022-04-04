import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { formatAPY, formatNumber, formatUSD } from "helpers/price-units";
import { trim } from "helpers/trim";
import { t } from "i18next";
import { memo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { calculateStakingRewards } from "store/modules/app/app.helpers";
import { MainSliceState } from "store/modules/app/app.types";
import { IAppSlice } from "store/slices/app-slice";
import { IReduxState } from "store/slices/state.interface";

interface StakeMetricsProps {
    APY: number;
    TVL: number;
    currentIndex: number;
    BASHPrice: number;
}

function StakeMetrics(props: StakeMetricsProps) {
    const { APY, TVL, currentIndex, BASHPrice } = props;

    const prices = useSelector<IReduxState, number | null>(state => {
        return state.markets.markets.dai;
    });

    console.log("Metrics", props);
    const metrics = [
        { key: "APY", value: formatNumber(APY) },
        { key: "TVL", value: formatUSD(TVL) },
        { key: "CurrentIndex", value: `${formatNumber(Number(currentIndex), 2)} BASH` },
        { key: "BASHPrice", value: formatUSD(BASHPrice, 2) },
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
