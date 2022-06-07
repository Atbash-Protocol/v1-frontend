import { Grid } from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

import MenuMetric from 'components/Metrics/MenuMetric';
import { selectSBASHBalance } from 'store/modules/account/account.selectors';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectStakingRebasePercentage } from 'store/modules/metrics/metrics.selectors';

const ForecastMetrics = () => {
    const BASHPrice = useSelector(selectFormattedReservePrice);
    const stakingPercentage = useSelector(selectStakingRebasePercentage);
    const SBashBalance = useSelector(selectSBASHBalance);

    const metrics = [
        { key: 'BASHPrice', value: BASHPrice },
        { key: 'globe:CurrentRewardYield', value: stakingPercentage },
        { key: 'globe:YourStakedBASHBalance', value: `${SBashBalance} SBASH` },
    ].map(({ key, value }) => (
        <Grid item key={key} xs={6} sm={4} md={4} lg={4} mt={2}>
            <MenuMetric metricKey={t(key)} value={value} />
        </Grid>
    ));

    return (
        <Grid container spacing={2}>
            {metrics}
        </Grid>
    );
};

export default ForecastMetrics;
