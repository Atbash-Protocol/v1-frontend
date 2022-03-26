import { useSelector } from "react-redux";
import { Zoom } from "@material-ui/core";
import { formatUSD, formatNumber } from "helpers/price-units";
import { IReduxState } from "store/slices/state.interface";
import { IAppSlice } from "store/slices/app-slice";

import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { theme } from "constants/theme";
import { Metric } from "./components/Metric";

import "./dashboard.scss";

function Dashboard() {
    const { t } = useTranslation();

    const { loading: isAppLoading, ...app } = useSelector<IReduxState, IAppSlice>(state => state.app);

    const trimmedStakingAPY = formatNumber(app.stakingAPY * 100, 1);

    const DashboardItems = [
        { name: "RiskFreeValue", value: formatUSD(app.rfv) },
        { name: "RiskFreeValuewsBASH", value: formatUSD(app.rfv * Number(app.currentIndex)) },
        { name: "BashPrice", value: formatNumber(app.marketPrice, 2) },
        { name: "wsBASHPrice", value: formatNumber(app.marketPrice * Number(app.currentIndex), 2) },
        { name: "MarketCap", value: app.marketCap },
        { name: "TVL", value: app.stakingTVL },
        { name: "APY", value: `${trimmedStakingAPY} %` },
        { name: "CurrentIndex", value: `${formatNumber(Number(app.currentIndex), 2)} BASH` },
        { name: "treasuryBalance", value: formatUSD(app.treasuryBalance, 0) },
        { name: "Runway", value: `${formatNumber(Number(app.runway), 1)} Days` },
    ];

    return (
        <Box>
            <Zoom in={true}>
                <Grid container spacing={6} sx={{ p: 2 }} justifyContent="space-around">
                    {DashboardItems.map(metric => (
                        <Grid key={`dashboard-item-${metric.name}`} item lg={6} md={6} sm={6} xs={12}>
                            <Box
                                className="Dashboard__box__item"
                                sx={{
                                    backgroundColor: theme.palette.cardBackground.main,
                                    backdropFilter: "blur(100px)",
                                    borderRadius: ".5rem",
                                    color: theme.palette.secondary.main,
                                    px: theme.spacing(2),
                                    py: theme.spacing(4),
                                    textAlign: "center",
                                }}
                            >
                                <Metric name={t(metric.name)} value={metric.value} loading={isAppLoading} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Zoom>
        </Box>
    );
}

export default Dashboard;
