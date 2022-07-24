import { Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Loader from 'components/Loader';
import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { theme } from 'constants/theme';
import { formatUSD } from 'helpers/price-units';
import { selectBondItemMetrics, selectBondMintingMetrics, selectBondsReady } from 'store/modules/bonds/bonds.selector';
import { BondMetrics } from 'store/modules/bonds/bonds.types';
import { RootState } from 'store/store';

import BondPurchase from '../BondPurchase';

const Mint = ({ bondID, metrics }: { bondID: string; metrics: BondMetrics }) => {
    const { t } = useTranslation();
    const { balance, quote, maxBondPrice, vestingTerm, bondDiscount } = selectBondMintingMetrics(metrics);

    const bondMetrics = [
        { value: balance, metricKey: t('bond:YourBalance') },
        { value: quote, metricKey: t('bond:YouWillGet') },
        { value: maxBondPrice ? formatUSD(maxBondPrice, 2).toString() : null, metricKey: t('bond:MaxYouCanBuy') },
        { metricKey: t('bond:Discount'), value: bondDiscount },
        { metricKey: t('bond:VestingTerm'), value: t('common:day', { count: vestingTerm || 0 }) },
        { metricKey: t('bond:MinimumPurchase'), value: '0.01 BASH' },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    return (
        <Box>
            <BondPurchase bondID={bondID} />
            <Divider variant="fullWidth" textAlign="center" sx={{ borderColor: theme.palette.primary.light, marginBottom: theme.spacing(2) }} />
            <Box>{bondMetrics}</Box>
        </Box>
    );
};

const MintLoader = ({ bondID }: { bondID: string }) => {
    const bondsReady = useSelector(selectBondsReady);
    const metrics = useSelector((state: RootState) => selectBondItemMetrics(state, bondID));

    if (!bondsReady) return <Loader />;

    return <Mint bondID={bondID} metrics={metrics} />;
};

export default MintLoader;
