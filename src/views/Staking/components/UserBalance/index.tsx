import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { theme } from 'constants/theme';
import { selectFormattedStakeBalance } from 'store/modules/account/account.selectors';
import { selectFormattedBashBalance } from 'store/modules/markets/markets.selectors';
import { selectTotalBalance } from 'store/modules/metrics/metrics.selectors';
import { selectStakingBalance } from 'store/modules/stake/stake.selectors';

const UserBalance = () => {
    const { t } = useTranslation();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const totalBalance = useSelector(selectTotalBalance);
    const stakingBalanceMetrics = useSelector(selectStakingBalance);
    const { WSBASH: WSBashBalance } = useSelector(selectFormattedStakeBalance);

    const BASHPrice = useSelector(selectFormattedBashBalance);

    const userBalances = [
        { key: 'stake:ValueOfYourBASH', value: BASHPrice },
        { key: 'stake:ValueOfYourStakedBASH', value: WSBashBalance },
        { key: 'stake:ValueOfYourNextRewardAmount', value: stakingBalanceMetrics.wrappedTokenValue },
        { key: 'stake:ValueOfYourEffectiveNextRewardAmount', value: stakingBalanceMetrics.effectiveNextRewardValue },
    ];

    const balanceItems = userBalances.map(({ key, value }) => <MemoInlineMetric key={key} metricKey={key} value={value} />);

    return (
        <>
            <Box sx={{ display: 'inline-flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.primary.light }}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>
                    <>{t('YourBalance')}</>
                </Typography>
                <Typography variant="h4">
                    <> {totalBalance}</>
                </Typography>
            </Box>

            {balanceItems}
        </>
    );
};

export default UserBalance;
