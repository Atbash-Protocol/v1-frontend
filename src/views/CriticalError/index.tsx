import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BCard } from 'components/BCard';

const CritialError = () => {
    const { t } = useTranslation('common');

    return (
        <BCard title={t('errors.critical')} zoom>
            <Typography variant="body1">
                <>{t('errors.network')}</>
            </Typography>
        </BCard>
    );
};

export default CritialError;
