import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Loader from 'components/Loader';
import { theme } from 'constants/theme';
import { selectBondInstances } from 'store/modules/bonds/bonds.selector';

const NotFound = () => {
    const { t } = useTranslation();

    const bondsReady = useSelector(selectBondInstances);

    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                height: '100%',
            }}
        >
            {bondsReady.length === 0 && <Loader />}
            {bondsReady.length > 0 && (
                <Typography variant="h1" sx={{ textAlign: 'center', fontWeight: '600', color: theme.palette.primary.main }}>
                    <>{t('PageNotFound')}</>
                </Typography>
            )}
        </Box>
    );
};

export default NotFound;
