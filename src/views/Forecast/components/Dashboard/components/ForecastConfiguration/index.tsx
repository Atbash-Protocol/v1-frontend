import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import BInput from 'components/BInput';
import { theme } from 'constants/theme';

interface ConfigurationProps {
    onConfigurationChange: (formValues: Record<string, string>) => void;
    initialData: Record<string, string>;
}

const Configuration = ({ onConfigurationChange, initialData }: ConfigurationProps) => {
    const { t } = useTranslation();

    const handleConfigurationChange = (data: Record<string, string>) => {
        onConfigurationChange({ ...initialData, ...data });
    };

    return (
        <Box color={theme.palette.primary.light}>
            <Box color={theme.palette.primary.light} mt={theme.spacing(2)}>
                <Typography variant="body2" align="center">
                    {t('globe:StakedSBAmount')}
                </Typography>
                <BInput name="stakedSBAmount" onChange={handleConfigurationChange} defaultValue={initialData.stakedSBAmount} placeholder={t('globe:EnterStakedBASHAmount')} />
            </Box>

            <Box mt={theme.spacing(2)}>
                <Typography variant="body2" align="center">
                    {t('globe:RewardYieldPercent')}
                </Typography>
                <BInput
                    name="rewardYieldPercent"
                    onChange={handleConfigurationChange}
                    defaultValue={initialData.rewardYieldPercent}
                    endAdornmentLabel={t('globe:Current')}
                    placeholder={t('globe:EnterRewardYieldPercent')}
                />
            </Box>

            <Box mt={theme.spacing(2)}>
                <Typography variant="body2" align="center">
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

            <Box mt={theme.spacing(2)}>
                <Typography variant="body2" align="center">
                    {t('globe:FutureBASHMarketPrice')}
                </Typography>
                <BInput
                    name="futureBASHMarketPrice"
                    onChange={handleConfigurationChange}
                    defaultValue={initialData.futureBASHMarketPrice}
                    endAdornmentLabel={t('globe:Current')}
                    placeholder={t('globe:EnterFuturePrice')}
                />
            </Box>
        </Box>
    );
};

export default Configuration;
