import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { theme } from 'constants/theme';
import { formatUSDFromDecimal } from 'helpers/price-units';
import { selectBalancesInUSD } from 'store/modules/account/account.selectors';

export const WrapBalanceMetrics = () => {
    const { BASH, SBASH } = useSelector(selectBalancesInUSD);

    const totalBalance = formatUSDFromDecimal(BASH.add(SBASH), 2);

    const balanceMetrics = [
        { key: t('wrap:ValueOfYourBASH'), value: formatUSDFromDecimal(BASH, 2) },
        { key: t('wrap:ValueOfYourStakedBASH'), value: formatUSDFromDecimal(SBASH, 2) },
    ].map(({ key: metricKey, value }, i) => <MemoInlineMetric key={`metric-${i}`} {...{ metricKey, value }} />);

    return (
        <>
            <Box sx={{ display: 'inline-flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.light }}>
                <Typography variant="h4">
                    <>{t('YourBalance')}</>
                </Typography>
                <Typography variant="h4">
                    <> {totalBalance}</>
                </Typography>
            </Box>

            {balanceMetrics}
        </>
    );
};
