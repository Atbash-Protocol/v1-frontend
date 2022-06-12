import { useMemo } from 'react';

import { Slider, Box, Typography, styled, useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

interface DaysPickerProps {
    currentDay: number;
    onChange: (value: number) => void;
    minDays: number;
    maxDays: number;
}

const BSlider = styled(Slider)({
    color: blue[600],
});

const DaysPicker = ({ currentDay, onChange, minDays, maxDays }: DaysPickerProps) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: Event, sliderValue: number | Array<number>) => {
        event.preventDefault();
        onChange(Array.isArray(sliderValue) ? sliderValue[0] : sliderValue);
    };

    return (
        <Box
            height={'90%'}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                [theme.breakpoints.up('xs')]: {
                    width: '100%',
                    marginTop: '1rem',
                },
            }}
            pb={theme.spacing(2)}
        >
            <Typography
                variant="body1"
                color={theme.palette.primary.light}
                mb={theme.spacing(2)}
                sx={{
                    [theme.breakpoints.up('xs')]: {
                        marginBottom: 0,
                    },
                }}
            >
                {t('common:day_other', { count: currentDay })}
            </Typography>
            <BSlider
                orientation={isMobile ? 'horizontal' : 'vertical'}
                defaultValue={20}
                value={currentDay}
                min={minDays}
                max={maxDays}
                size={'medium'}
                valueLabelDisplay="auto"
                onChange={handleChange}
            />
        </Box>
    );
};

const MemoDaysPicker = ({ currentDay, ...props }: DaysPickerProps) => useMemo(() => <DaysPicker currentDay={currentDay} {...props} />, [currentDay]);

export default MemoDaysPicker;
