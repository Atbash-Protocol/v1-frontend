import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BCard } from 'components/BCard';
import { theme } from 'constants/theme';

import ForecastMetrics from './components/ForecastMetrics';
import Form from './components/Form';

function Forecast() {
    const { t } = useTranslation();

    return (
        <BCard title={t('globe:ForecastTitle')} zoom={true}>
            <Typography sx={{ color: theme.palette.primary.light }}>
                <>{t('globe:EstimateYourReturns')} </>
            </Typography>
            <Typography sx={{ color: theme.palette.primary.light, mt: theme.spacing(2) }}>
                <>{t('globe:ForecastWarning')} </>
            </Typography>

            <ForecastMetrics />

            <Form />
        </BCard>
    );
}

export default Forecast;
