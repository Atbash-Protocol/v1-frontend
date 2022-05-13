import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { selectFormattedStakeBalance } from 'store/modules/account/account.selectors';
import { selectFormattedBashBalance } from 'store/modules/markets/markets.selectors';
import { selectTotalBalance } from 'store/modules/metrics/metrics.selectors';
import { selectStakingBalance } from 'store/modules/stake/stake.selectors';

const UserBalance = () => {
    const { t } = useTranslation();

    const totalBalance = useSelector(selectTotalBalance);
    const stakingBalanceMetrics = useSelector(selectStakingBalance);
    const { SBASH: SBashBalance, WSBASH: WSBashBalance } = useSelector(selectFormattedStakeBalance);
    const BASHPrice = useSelector(selectFormattedBashBalance);

    const userBalances = [
        {
            key: 'stake:ValueOfYourBASH',
            value: BASHPrice,
        },
        {
            key: 'stake:YourStakedBalance',
            value: SBashBalance,
        },
        {
            key: 'stake:YourWrappedStakedBalance',
            value: WSBashBalance,
        },
        {
            key: 'stake:WrappedTokenEquivalent',
            value: stakingBalanceMetrics.wrappedTokenValue,
        },
        {
            key: 'stake:NextRewardAmount',
            value: stakingBalanceMetrics.nextRewardValue,
        },
        {
            key: 'stake:ValueOfYourEffectiveNextRewardAmount',
            value: stakingBalanceMetrics.effectiveNextRewardValue,
        },
        {
            key: 'stake:ValueOfYourWrappedStakedSB',
            value: stakingBalanceMetrics.wrappedTokenValue,
        },
    ];

    const balanceItems = userBalances.map(({ key, value }) => <MemoInlineMetric key={key} metricKey={key} value={value} />);

    return (
        <>
            <Box sx={{ display: 'inline-flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    <>{t('YourBalance')}</>
                </Typography>
                <Typography variant="h4">
                    <> {totalBalance === null ? <Skeleton /> : totalBalance}</>
                </Typography>
            </Box>

            {balanceItems}
        </>
    );
};

export default UserBalance;
