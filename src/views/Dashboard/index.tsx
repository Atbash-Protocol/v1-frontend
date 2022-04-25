import './dashboard.scss';
import { Box, Skeleton, Typography, Zoom } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import Loading from 'components/Loader';
import { theme } from 'constants/theme';
import { formatUSD, formatAPY } from 'helpers/price-units';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectDAIPrice } from 'store/modules/markets/markets.selectors';
import { selectFormattedMarketCap, selectStakingRewards, selectTVL, selectWSBASHPrice } from 'store/modules/metrics/metrics.selectors';
import { selectFormattedIndex } from 'store/modules/stake/stake.selectors';
import { IReduxState } from 'store/slices/state.interface';

function Dashboard() {
    const { t } = useTranslation();

    const marketPrice = useSelector(selectDAIPrice);
    const loading = useSelector<IReduxState, boolean>(state => state.markets.loading, shallowEqual);

    const bashPrice = useSelector(selectFormattedReservePrice);
    const wsPrice = useSelector(selectWSBASHPrice);
    const marketCap = useSelector(selectFormattedMarketCap);
    const stakingRewards = useSelector(selectStakingRewards);
    const TVL = useSelector(selectTVL);
    const currentIndex = useSelector(selectFormattedIndex);

    if (!marketPrice || loading) return <Loading />;

    const APYMetrics = stakingRewards
        ? [
              { name: 'APY', value: stakingRewards ? formatAPY(stakingRewards.stakingAPY.toString()) : null },
              { name: 'CurrentIndex', value: currentIndex },
              { name: 'wsBASHPrice', value: wsPrice },
          ]
        : [];

    const DashboardItems = [
        { name: 'BashPrice', value: bashPrice },
        { name: 'MarketCap', value: marketCap },
        { name: 'TVL', value: formatUSD(TVL || 0, 2) },

        ...APYMetrics,
        // { name: "RiskFreeValue", value: formatUSD(app.rfv) },
        // { name: "RiskFreeValuewsBASH", value: formatUSD(app.rfv * Number(app.currentIndex)) },
        // { name: "treasuryBalance", value: formatUSD(app.treasuryBalance, 0) },
        // { name: "Runway", value: `${formatNumber(Number(app.runway), 1)} Days` },
    ];

    return (
        <Box>
            <Grid container spacing={6} sx={{ p: 2 }} justifyContent="space-around">
                {DashboardItems.map(metric => (
                    <Grid key={`dashboard-item-${metric.name}`} item lg={6} md={6} sm={6} xs={12}>
                        <Box
                            className="Dashboard__box__item"
                            sx={{
                                backgroundColor: theme.palette.cardBackground.main,
                                backdropFilter: 'blur(100px)',
                                borderRadius: '.5rem',
                                color: theme.palette.primary.main,
                                px: theme.spacing(2),
                                py: theme.spacing(4),
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                flex: '1 1 auto',
                                overflow: 'auto',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h5">
                                <>{t(metric.name)}</>
                            </Typography>
                            <Typography sx={{ overflowX: 'hidden' }} variant="h6">
                                {loading ? <Skeleton /> : <>{metric.value}</>}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
