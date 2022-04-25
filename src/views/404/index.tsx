import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                height: '100%',
            }}
        >
            <Typography variant="h1" sx={{ textAlign: 'center', fontWeight: '600', color: theme.palette.primary.main }}>
                <>{t('PageNotFound')}</>
            </Typography>
        </Box>
    );
};

export default NotFound;
