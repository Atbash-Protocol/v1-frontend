/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from 'react';

import { Close } from '@mui/icons-material';
import { Box, Paper, SvgIcon, IconButton, FormControl, OutlinedInput, InputAdornment, Typography, FormHelperText, FormLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

interface IAdvancedSettingsProps {
    handleChange: (args: { recipientAddress: string; slippage: number }) => void;
    handleClose: () => void;
    slippage: number;
    recipientAddress: string;
}

export const AdvancedSettings = ({ slippage, recipientAddress, handleChange, handleClose }: IAdvancedSettingsProps) => {
    const { t } = useTranslation();

    const [slippageValue, setSlippageValue] = useState(slippage.toString());
    const [address, setAddress] = useState(recipientAddress);

    useEffect(() => {
        handleChange({ recipientAddress: address, slippage: Number(slippageValue) });
    }, [slippageValue, address]);

    return (
        <Paper sx={{ p: theme.spacing(2), pb: theme.spacing(4) }}>
            <Box textAlign={'right'}>
                <IconButton onClick={handleClose}>
                    <SvgIcon color="primary" component={Close} />
                </IconButton>
            </Box>

            <Typography variant="h4">
                <>{t('bond:Settings')}</>
            </Typography>

            <Box mt={theme.spacing(4)}>
                <FormControl variant="outlined" color="primary" fullWidth>
                    <FormLabel component="legend">
                        <>{t('bond:Slippage')}</>
                    </FormLabel>
                    <OutlinedInput
                        value={slippageValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            console.log('here', e.target.value);
                            setSlippageValue(e.target.value);
                        }}
                        fullWidth
                        type="number"
                        endAdornment={
                            <InputAdornment position="end">
                                <> %</>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>
                        <>{t('bond:SlippageHelpText')}</>
                    </FormHelperText>
                </FormControl>

                <FormControl variant="outlined" color="primary" fullWidth sx={{ mt: theme.spacing(4) }}>
                    <FormLabel component="legend">
                        <>{t('bond:RecipientAddress')}</>
                    </FormLabel>
                    <OutlinedInput className="bond-input" id="recipient" value={address} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} type="text" />
                    <FormHelperText>
                        <>{t('bond:RecipientAddressHelpText')}</>
                    </FormHelperText>
                </FormControl>
            </Box>
        </Paper>
    );
};

export default AdvancedSettings;
