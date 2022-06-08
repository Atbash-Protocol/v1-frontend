import { useState } from 'react';

import { Box, Grid, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import BInput from 'components/BInput';
import { theme } from 'constants/theme';

const MAX_DAYS = 365;

const DaysPicker = () => {
    const { t } = useTranslation();
    const [days, setDays] = useState(0);

    const handleCommitedChange = (event: React.SyntheticEvent | Event, sliderValue: number | Array<number>) => {
        event.preventDefault();

        console.log('Change', sliderValue);
    };

    const handleChange = (event: Event, sliderValue: number | Array<number>) => {
        event.preventDefault();

        const value = Array.isArray(sliderValue) ? sliderValue[0] : sliderValue;
        setDays(value);
    };

    return (
        <Box width={100} height={'10rem'} sx={{ justifyContent: 'center', alignItems: 'center' }} pb={theme.spacing(2)}>
            <Typography variant="body1" color={theme.palette.primary.light} mb={theme.spacing(2)}>
                {t('common:day_other', { count: days })}
            </Typography>
            <Slider
                orientation="vertical"
                defaultValue={20}
                value={days}
                max={MAX_DAYS}
                valueLabelDisplay="auto"
                onChange={handleChange}
                onChangeCommitted={handleCommitedChange}
            />
        </Box>
    );
};

const Configuration = () => {
    // get SBASH Amount, reward yield, BASH price from props

    const [BASHAmount, SetBASHAmount] = useState('0');
    const [rewardYield, setRewardYield] = useState('0');
    const [bashPrice, setBashPrice] = useState('0');
    const [futureBashPrice, setFutureBashPrice] = useState('0');

    return (
        <>
            <Box>
                <Typography variant="body1">sBASH AMOUNT</Typography>
                <BInput onChange={() => SetBASHAmount('10')} defaultValue={'0'} maxValue={'300'} />
            </Box>

            <Box>
                <Typography variant="body1">REWARD YIELD (%)</Typography>
                <BInput onChange={() => setRewardYield('10')} defaultValue={'0'} maxValue={'300'} />
            </Box>

            <Box>
                <Typography variant="body1" align="center">
                    BASH Price AT PURCHASE ($)
                </Typography>
                <BInput onChange={() => setBashPrice('10')} defaultValue={'0'} maxValue={'300'} />
            </Box>

            <Box>
                <Typography variant="body1">Future BASH MARKET PRICE ($)</Typography>
                <BInput onChange={() => setFutureBashPrice('10')} defaultValue={'0'} maxValue={'300'} />
            </Box>
        </>
    );
};

const ForecastDetails = () => {
    return (
        <>
            <span>Initial investment</span>
            <span>Current wealth</span>
            <span>Bash rewards estimation</span>
            <span>Potential return</span>
            <span>Lambo prices</span>
        </>
    );
};

const Form = () => {
    return (
        <Grid container>
            <Grid item xs={5}>
                <Configuration />
            </Grid>
            <Grid item xs={2}>
                <DaysPicker />
            </Grid>
            <Grid item xs={5}>
                <ForecastDetails />
            </Grid>
        </Grid>
    );
};

export default Form;
