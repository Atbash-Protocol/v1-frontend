import { Grid } from '@mui/material';
import Decimal from 'decimal.js';
import { t } from 'i18next';

import MenuMetric from 'components/Metrics/MenuMetric';
import { formatUSDFromDecimal } from 'helpers/price-units';

interface ForecastMetricsProps {
    BASHPrice: Decimal;
    SBASHBalance: Decimal;
    stakingPercentage: Decimal;
}

const ForecastMetrics = ({ BASHPrice, stakingPercentage, SBASHBalance }: ForecastMetricsProps) => {
    const metrics = [
        { key: 'BASHPrice', value: formatUSDFromDecimal(BASHPrice, 2) },
        { key: 'globe:CurrentRewardYield', value: formatUSDFromDecimal(stakingPercentage) },
        { key: 'globe:YourStakedBASHBalance', value: `${SBASHBalance.toFixed(2)} SBASH` },
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
