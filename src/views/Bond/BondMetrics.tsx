import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MemoInlineMetric from 'components/Metrics/InlineMetric';

const BondMetrics = ({ bond }: any) => {
    const { t } = useTranslation();

    if (!bond) {
        return <> </>;
    }

    const { maxBondPrice, bondDiscount, vestingTerm } = bond;

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

export default BondMetrics;
