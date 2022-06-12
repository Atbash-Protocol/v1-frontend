import { useState } from 'react';

import { Grid } from '@mui/material';
import Decimal from 'decimal.js';

import { theme } from 'constants/theme';
import { MIN_DAYS, MAX_DAYS } from 'views/Forecast/config';

import DaysPicker from './components/DaysPicker';
import ForecastConfiguration from './components/ForecastConfiguration';
import ForecastDetails from './components/ForecastDetails';

interface ForecastFormProps {
    BASHPrice: Decimal;
    SBASHBalance: Decimal;
    stakingPercentage: Decimal;
}

const Dashboard = ({ BASHPrice, stakingPercentage, SBASHBalance }: ForecastFormProps) => {
    const initialData = {
        BASHPrice,
        SBASHBalance,
        stakingPercentage,
    };

    const [formData, setFormData] = useState<Record<string, string>>({
        stakedSBAmount: initialData.SBASHBalance.toString(),
        rewardYieldPercent: initialData.stakingPercentage.toFixed(2),
        BASHPriceAtPurchase: initialData.BASHPrice.toFixed(2),
        futureBASHMarketPrice: initialData.BASHPrice.toFixed(2),
    });

    const [days, setDays] = useState(MIN_DAYS);

    return (
        <Grid container mt={theme.spacing(4)}>
            <Grid item xs={12} sm={5}>
                <ForecastConfiguration onConfigurationChange={setFormData} initialData={formData} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <DaysPicker currentDay={days} onChange={setDays} minDays={MIN_DAYS} maxDays={MAX_DAYS} />
            </Grid>
            <Grid item xs={12} sm={5}>
                <ForecastDetails data={formData} initialPrice={BASHPrice} duration={days} />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
