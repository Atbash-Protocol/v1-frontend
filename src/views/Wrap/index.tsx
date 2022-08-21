import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { BCard } from 'components/BCard';
import { BMultiTabs } from 'components/BMultiTab/BMultiTab';
import MemoInlineMetric from 'components/Metrics/InlineMetric';
import MenuMetric from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { selectFormattedStakeBalance } from 'store/modules/account/account.selectors';
import { selectFormattedIndex } from 'store/modules/stake/stake.selectors';

import { WrapBalanceMetrics } from './components/BalanceMetrics';
import { UnWrapAction } from './components/UnWrapAction';
import { WrapAction } from './components/WrapAction';

function Wrap() {
    const { t } = useTranslation();

    const currentIndex = useSelector(selectFormattedIndex);
    const balances = useSelector(selectFormattedStakeBalance);

    const wrapMetrics = [
        { key: t('common:YourBalance'), value: balances.BASH },
        { key: t('wrap:YourStakedBalance'), value: balances.SBASH },
    ].map(({ key: metricKey, value }, i) => <MemoInlineMetric key={`metric-${i}`} {...{ metricKey, value }} />);

    const tabs = [
        { label: t('Wrap:Wrap'), component: <WrapAction /> },
        { label: t('Wrap:UnWrap'), component: <UnWrapAction /> },
    ];

    return (
        <>
            <BCard title={t('wrap:WrapTitle')} zoom={true}>
                <Typography sx={{ color: theme.palette.primary.dark }}>
                    <>{t('wrap:WrapYourBASH')} </>
                </Typography>

                <Grid container pt={theme.spacing(4)}>
                    <Grid xs={2} item>
                        <MenuMetric metricKey={t('common:CurrentIndex')} value={currentIndex} />
                    </Grid>
                </Grid>

                <Box>
                    <BMultiTabs tabs={tabs} />
                </Box>

                <Box mt={theme.spacing(4)}>{wrapMetrics}</Box>
            </BCard>

            <BCard title={''} zoom={true}>
                <WrapBalanceMetrics />
            </BCard>
        </>
    );
}

export default Wrap;
