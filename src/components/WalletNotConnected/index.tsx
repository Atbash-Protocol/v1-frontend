import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import './styles.scss';

export const WalletNotConnected = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Box
            className="WalletNotConnected"
            sx={{
                height: 300,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            {t('walletNotConnected')}
        </Box>
    );
};
