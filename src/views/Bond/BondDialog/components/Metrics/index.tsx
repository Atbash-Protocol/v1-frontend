import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { formatUSD } from 'helpers/price-units';
import { selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { BondMetrics as BondMetricsProps } from 'store/modules/bonds/bonds.types';

const BondMetrics = ({ bondMetrics }: { bondMetrics: BondMetricsProps }) => {
    const { t } = useTranslation();

    const { maxBondPrice, balance, quote, bondDiscount, vestingTerm } = selectBondMintingMetrics(bondMetrics);

    const metrics2 = [
        { value: balance, metricKey: t('bond:YourBalance') },
        { value: quote, metricKey: t('bond:YouWillGet') },
        { value: maxBondPrice ? formatUSD(maxBondPrice, 2).toString() : null, metricKey: t('bond:MaxYouCanBuy') },
        { metricKey: t('bond:Discount'), value: bondDiscount },
        { metricKey: t('bond:VestingTerm'), value: t('common:day', { count: vestingTerm || 0 }) },
        { metricKey: t('bond:MinimumPurchase'), value: '0.01 BASH' },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    return (
        <Grid item xs={12} container>
            {metrics2}
        </Grid>
    );
};

export default BondMetrics;
