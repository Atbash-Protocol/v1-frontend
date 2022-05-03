import { Grid, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MenuMetric from 'components/Metrics/MenuMetric';
import { formatAPY, formatUSD } from 'helpers/price-units';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectStakingRewards, selectTVL } from 'store/modules/metrics/metrics.selectors';
import { selectFormattedIndex } from 'store/modules/stake/stake.selectors';

function StakeMetrics() {
    const stakingMetrics = useSelector(selectStakingRewards);
    const TVL = useSelector(selectTVL);
    const BASHPrice = useSelector(selectFormattedReservePrice);
    const currentIndex = useSelector(selectFormattedIndex);

    const { t } = useTranslation();

    if (!stakingMetrics || !TVL) return <Skeleton />;

    const metrics = [
        { key: 'APY', value: `${formatAPY(stakingMetrics.stakingAPY.toString())} %` },
        { key: 'TVL', value: formatUSD(TVL) },
        { key: 'CurrentIndex', value: currentIndex },
        { key: 'BASHPrice', value: BASHPrice },
    ].map(({ key, value }) => (
        <Grid key={key} xs={6} sm={4} md={4} lg={3} mt={2}>
            <MenuMetric metricKey={t(key)} value={value} />
        </Grid>
    ));

    return (
        <Grid container spacing={2}>
            {metrics}
        </Grid>
    );
}

export default StakeMetrics;
