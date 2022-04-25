import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BCard } from 'components/BCard';

function Forecast() {
    const { t } = useTranslation();

    return (
        <BCard title={t('bond:Forecast')} zoom={true}>
            <Typography> {t('ComingSoon')} </Typography>
        </BCard>
    );
}

export default Forecast;
