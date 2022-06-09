import { useMemo } from 'react';

import { Slider, Box, Typography, styled } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

interface DaysPickerProps {
    currentDay: number;
    onChange: (value: number) => void;
    minDays: number;
    maxDays: number;
}

const BSlider = styled(Slider)({ color: blue[300] });

const DaysPicker = ({ currentDay, onChange, minDays, maxDays }: DaysPickerProps) => {
    const { t } = useTranslation();

    const handleChange = (event: Event, sliderValue: number | Array<number>) => {
        event.preventDefault();
        onChange(Array.isArray(sliderValue) ? sliderValue[0] : sliderValue);
    };

    return (
        <Box width={100} height={'10rem'} sx={{ justifyContent: 'center', alignItems: 'center' }} pb={theme.spacing(2)}>
            <Typography variant="body1" color={theme.palette.primary.light} mb={theme.spacing(2)}>
                {t('common:day_other', { count: currentDay })}
            </Typography>
            <BSlider orientation="vertical" defaultValue={20} value={currentDay} min={minDays} max={maxDays} valueLabelDisplay="auto" onChange={handleChange} />
        </Box>
    );
};

const MemoDaysPicker = ({ currentDay, ...props }: DaysPickerProps) => useMemo(() => <DaysPicker currentDay={currentDay} {...props} />, [currentDay]);

export default MemoDaysPicker;
