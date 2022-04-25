import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { BondMetrics } from 'store/modules/bonds/bonds.types';

const CBondMetrics = ({ bondMetrics }: { bondMetrics: BondMetrics }) => {
    const { t } = useTranslation();

    const metrics = selectBondMintingMetrics(bondMetrics);

    if (!metrics) {
        return <> </>;
    }

    const { maxBondPrice, bondDiscount, vestingTerm } = metrics;

    const metrics2 = [
        { value: (maxBondPrice ?? '').toString(), metricKey: t('bond:MaxYouCanBuy') },
        {
            metricKey: t('bond:ROI'),
            value: bondDiscount,
        },
        { metricKey: t('bond:MinimumPurchase'), value: vestingTerm },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    return (
        <Grid xs={12} container>
            {metrics2}
        </Grid>
    );
};

export default CBondMetrics;
