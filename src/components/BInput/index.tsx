import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { OutlinedInput, InputAdornment, Box, Typography, SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

interface BInputProps {
    name: string;
    defaultValue: string;
    onChange: (value: Record<string, string>) => void;
    maxValue?: string;
    placeholder?: string;
    endAdornmentLabel?: string;
    extraSxProps?: SxProps<Theme> | undefined;
}

const BInput = ({ name, defaultValue, maxValue, onChange, endAdornmentLabel, placeholder, extraSxProps }: BInputProps) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(defaultValue);

    const handleClickMaxValue = (event: SyntheticEvent<HTMLDivElement>) => {
        event.preventDefault();
        setValue(maxValue ?? defaultValue);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const inputValue = event.target.value;

        setValue(inputValue);
        onChange({ [name]: inputValue });
    };

    return (
        <OutlinedInput
            sx={{
                color: theme.palette.primary.main,
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderRadius: 0,
                outlineColor: theme.palette.primary.main,
                width: '100%',
                ...(extraSxProps ?? {}),
            }}
            name={name}
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
