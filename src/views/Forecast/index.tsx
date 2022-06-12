import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { BCard } from 'components/BCard';
import { theme } from 'constants/theme';
import { selectSBASHBalance } from 'store/modules/account/account.selectors';
import { selectComputedMarketPrice } from 'store/modules/markets/markets.selectors';
import { selectStakingRebasePercentage } from 'store/modules/metrics/metrics.selectors';

import Dashboard from './components/Dashboard';
import ForecastMetrics from './components/Dashboard/components/ForecastMetrics';

function Forecast() {
    const { t } = useTranslation();

    const BASHPrice = useSelector(selectComputedMarketPrice);
    const stakingPercentage = useSelector(selectStakingRebasePercentage);
    const SBASHBalance = useSelector(selectSBASHBalance);

    return (
        <BCard title={t('globe:ForecastTitle')} zoom={true}>
            <Typography sx={{ color: theme.palette.primary.light }}>
                <>{t('globe:EstimateYourReturns')} </>
            </Typography>
            <Typography sx={{ color: theme.palette.primary.light, mt: theme.spacing(2) }}>
                <>{t('globe:ForecastWarning')} </>
            </Typography>

            <ForecastMetrics {...{ BASHPrice, stakingPercentage, SBASHBalance }} />

            <Dashboard {...{ BASHPrice, stakingPercentage, SBASHBalance }} />
        </BCard>
    );
}

export default Forecast;
