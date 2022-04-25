import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CritialError = () => {
    const { t } = useTranslation('common');

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h1">
                <>{t('errors.critical')}</>
            </Typography>
        </Box>
    );
};

export default CritialError;
