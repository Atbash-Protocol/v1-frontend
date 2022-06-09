import { useState } from 'react';

import { Box, Grid, Slider, styled, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';

import BInput from 'components/BInput';
import { theme } from 'constants/theme';
import { formatUSD } from 'helpers/price-units';

import DaysPicker from '../DaysPicker';

const MIN_DAYS = 1;
const MAX_DAYS = 365;
const LAMBO_PRICE = 222_004;
const EPOCH_PER_DAY = 3;

enum ConfigurationItemEnum {
    StakedSBAmount = 'StakedSBAmount',
    RewardYieldPercent = 'RewardYieldPercent',
    BASHPriceAtPurchase = 'BASHPriceAtPurchase',
    FutureBASHMarketPrice = 'FutureBASHMarketPrice',
}
interface ConfigurationData {
    StakedSBAmount: string;
    RewardYieldPercent: string;
    BASHPriceAtPurchase: string;
    FutureBASHMarketPrice: string;
}
interface ConfigurationProps {
    onConfigurationChange: (formValues: Record<ConfigurationItemEnum, string>) => void;
    initialData: ConfigurationData;
}

const Configuration = ({ onConfigurationChange, initialData }: ConfigurationProps) => {
    const { t } = useTranslation();

    const handleConfigurationChange = (data: Record<ConfigurationItemEnum, string>) => {
        console.log('Configuration', data, { ...initialData, ...data });
        onConfigurationChange({ ...initialData, ...data });
    };

    return (
        <Box color={theme.palette.primary.light}>
            <Box color={theme.palette.primary.light}>
                <Typography variant="body1" align="center">
                    {t('globe:StakedSBAmount')}
                </Typography>
                <BInput name="StakedSBAmount" onChange={handleConfigurationChange} defaultValue={initialData.StakedSBAmount} placeholder={t('globe:EnterStakedBASHAmount')} />
            </Box>

            <Box>
                <Typography variant="body1" align="center">
                    {t('globe:RewardYieldPercent')}
                </Typography>
                <BInput
                    name="RewardYieldPercent"
                    onChange={handleConfigurationChange}
                    defaultValue={initialData.RewardYieldPercent}
                    endAdornmentLabel={t('globe:Current')}
                    placeholder={t('globe:EnterRewardYieldPercent')}
                />
            </Box>

            <Box>
                <Typography variant="body1" align="center">
                    {t('globe:BASHPriceAtPurchase')}
                </Typography>
                <BInput
                    name="BASHPriceAtPurchase"
                    onChange={handleConfigurationChange}
                    defaultValue={initialData.BASHPriceAtPurchase}
                    endAdornmentLabel={t('globe:Current')}
                    placeholder={t('globe:EnterBuyPrice')}
                />
            </Box>

            <Box>
                <Typography variant="body1" align="center">
                    {t('globe:FutureBASHMarketPrice')}
                </Typography>
                <BInput
                    name="FutureBASHMarketPrice"
                    onChange={handleConfigurationChange}
                    defaultValue={initialData.FutureBASHMarketPrice}
                    endAdornmentLabel={t('globe:Current')}
                    placeholder={t('globe:EnterFuturePrice')}
                />
            </Box>
        </Box>
    );
};

interface ForecastDetailsProps {
    data: Record<ConfigurationItemEnum, string>;
    initialPrice: Decimal;
    duration: number;
}

const ForecastDetails = ({ data, duration, initialPrice }: ForecastDetailsProps) => {
    const { t } = useTranslation();
    const { StakedSBAmount, BASHPriceAtPurchase, RewardYieldPercent, FutureBASHMarketPrice } = data;

    const dailyROI = (1 + Number(RewardYieldPercent) / 100) ** (duration * EPOCH_PER_DAY) - 1;
    const BASHRewardsEstimation = Number(StakedSBAmount) * dailyROI;
    const PotentialReturn = (Number(StakedSBAmount) + BASHRewardsEstimation) * Number(FutureBASHMarketPrice);
    const nbLambo = Math.round(PotentialReturn / LAMBO_PRICE);

    const computedForecast = Object.entries({
        YourInitialInvestment: Number(StakedSBAmount) * Number(BASHPriceAtPurchase),
        CurrentWealth: initialPrice.toNumber() * Number(StakedSBAmount),
        PotentialReturn,
    }).map(([key, value], index) => {
        return (
            <Box key={index} sx={{ justifyContent: 'space-between', color: 'white', display: 'inline-flex', width: '100%' }}>
                <Typography variant="body1">{t(`globe:${key}`)}</Typography>
                <Typography variant="body1" noWrap>
                    {formatUSD(value, 2)}
                </Typography>
            </Box>
        );
    });

    const bashEstimation = (
        <Box key="bashEstimation" sx={{ justifyContent: 'space-between', color: 'white', display: 'inline-flex', width: '100%' }}>
            <Typography variant="body1">{t('globe:BASHRewardsEstimation')}</Typography>
            <Typography variant="body1">{Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(BASHRewardsEstimation)}</Typography>
        </Box>
    );

    const lambos = (
        <Box key="lambos" sx={{ justifyContent: 'space-between', color: 'white', display: 'inline-flex', width: '100%' }}>
            <Typography variant="body1">{t('globe:PotentialNumberLambo')}</Typography>
            <Typography variant="body1">{nbLambo}</Typography>
        </Box>
    );

    computedForecast.splice(2, 0, bashEstimation);

    return <>{[...computedForecast, lambos]}</>;
};

interface ForecastFormProps {
    BASHPrice: Decimal;
    SBASHBalance: Decimal;
    stakingPercentage: Decimal;
}
const Form = ({ BASHPrice, stakingPercentage, SBASHBalance }: ForecastFormProps) => {
    const initialData = {
        BASHPrice,
        SBASHBalance,
        stakingPercentage,
    };

    const [formData, setFormData] = useState({
        StakedSBAmount: initialData.SBASHBalance.toString(),
        RewardYieldPercent: initialData.stakingPercentage.toFixed(2),
        BASHPriceAtPurchase: initialData.BASHPrice.toFixed(2),
        FutureBASHMarketPrice: initialData.BASHPrice.toFixed(2),
    });

    const [days, setDays] = useState(MIN_DAYS);

    return (
        <Grid container>
            <Grid item xs={5}>
                <Configuration onConfigurationChange={setFormData} initialData={formData} />
            </Grid>
            <Grid item xs={2}>
                <DaysPicker currentDay={days} onChange={setDays} minDays={MIN_DAYS} maxDays={MAX_DAYS} />
            </Grid>
            <Grid item xs={5}>
                <ForecastDetails data={formData} initialPrice={BASHPrice} duration={days} />
            </Grid>
        </Grid>
    );
};

export default Form;
