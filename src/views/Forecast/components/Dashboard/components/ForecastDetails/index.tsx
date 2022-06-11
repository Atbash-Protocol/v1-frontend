import { Box, Typography } from '@mui/material';
import Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';
import { formatUSD } from 'helpers/price-units';

import { computeDailyROI, getBashRewardsEstimation, getLamboEstimation, getPotentialReturn } from './helper';

interface ForecastDetailsProps {
    data: Record<string, string>;
    initialPrice: Decimal;
    duration: number;
}

const ForecastDetails = ({ data, duration, initialPrice }: ForecastDetailsProps) => {
    const { t } = useTranslation();
    const { stakedSBAmount, BASHPriceAtPurchase, rewardYieldPercent, futureBASHMarketPrice } = data;

    const dailyROI = computeDailyROI(rewardYieldPercent, duration);
    const bashRewardsEstimation = getBashRewardsEstimation(stakedSBAmount, dailyROI);
    const potentialReturn = getPotentialReturn(stakedSBAmount, bashRewardsEstimation, futureBASHMarketPrice);
    const nbLambo = getLamboEstimation(potentialReturn);

    const computedForecast = [
        { key: 'globe:YourInitialInvestment', value: formatUSD(Number(stakedSBAmount) * Number(BASHPriceAtPurchase), 2) },
        { key: 'globe:CurrentWealth', value: formatUSD(initialPrice.toNumber() * Number(stakedSBAmount), 2) },
        { key: 'globe:BASHRewardsEstimation', value: Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(bashRewardsEstimation) },
        { key: 'globe:PotentialReturn', value: formatUSD(potentialReturn) },
    ].map(({ key, value }, index) => {
        return (
            <Box key={index} sx={{ justifyContent: 'space-between', color: 'white', display: 'inline-flex', width: '100%', mt: theme.spacing(2) }}>
                <Typography variant="body1">{t(key)}</Typography>
                <Typography variant="body1" noWrap>
                    {value}
                </Typography>
            </Box>
        );
    });

    const lambos = (
        <Box key="lambos" sx={{ justifyContent: 'space-between', color: 'white', display: 'inline-flex', width: '100%', mt: theme.spacing(2) }}>
            <Typography variant="body1">{t('globe:PotentialNumberLambo')}</Typography>
            <Typography variant="body1">{nbLambo}</Typography>
        </Box>
    );

    return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{[...computedForecast, lambos]}</Box>;
};

export default ForecastDetails;
