import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { OutlinedInput, InputAdornment, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

interface BInputProps {
    defaultValue: string;
    maxValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    endAdornmentLabel?: string;
}

const BInput = ({ defaultValue, maxValue, onChange, endAdornmentLabel, placeholder }: BInputProps) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(defaultValue);

    const handleClickMaxValue = (event: SyntheticEvent<HTMLDivElement>) => {
        event.preventDefault();
        setValue(maxValue);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        onChange(event.target.value);
    };

    return (
        <OutlinedInput
            sx={{
                color: theme.palette.primary.main,
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderRadius: 0,
                outlineColor: theme.palette.primary.main,
                borderRight: 'none',
                width: '100%',
            }}
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            inputProps={{ inputMode: 'numeric', pattern: '^[0-9]*[.,]?[0-9]*$' }}
            endAdornment={
                <InputAdornment position="end">
                    <Box sx={{ color: theme.palette.primary.main, textTransform: 'uppercase', cursor: 'pointer' }} onClick={handleClickMaxValue}>
                        <Typography>{endAdornmentLabel ?? t('Max')}</Typography>
                    </Box>
                </InputAdornment>
            }
        />
    );
};

export default BInput;
