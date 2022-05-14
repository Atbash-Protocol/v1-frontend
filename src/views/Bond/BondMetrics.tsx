import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { formatUSD } from 'helpers/price-units';
import { selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { BondMetrics } from 'store/modules/bonds/bonds.types';

const CBondMetrics = ({ bondMetrics }: { bondMetrics: BondMetrics }) => {
    const { t } = useTranslation();

    const metrics = selectBondMintingMetrics(bondMetrics);

    if (!metrics) {
        return <> </>;
    }

    const { maxBondPrice, bondDiscount, vestingTerm } = metrics;

    console.log('metrics', metrics);

    const metrics2 = [
        { value: maxBondPrice ? formatUSD(maxBondPrice, 2).toString() : null, metricKey: t('bond:MaxYouCanBuy') },
        {
            metricKey: t('bond:Discount'),
            value: bondDiscount,
        },
        { metricKey: t('bond:MinimumPurchase'), value: vestingTerm ? vestingTerm / 10 ** 6 : null },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    return (
        <Grid item xs={12} container>
            {metrics2}
        </Grid>
    );
};

export default CBondMetrics;
