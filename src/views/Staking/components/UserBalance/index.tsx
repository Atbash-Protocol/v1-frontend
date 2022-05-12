import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { formatNumber, formatUSD } from 'helpers/price-units';
import { AccountSlice } from 'store/modules/account/account.types';
import { selectFormattedBashBalance } from 'store/modules/markets/markets.selectors';
import { selectTotalBalance, selectWSBASHPrice } from 'store/modules/metrics/metrics.selectors';
import { selectStakingBalance } from 'store/modules/stake/stake.selectors';
import { IReduxState } from 'store/slices/state.interface';

interface UserBalanceProps {
    stakingAPY: number;
    stakingRebase: number;
    daiPrice: number | null;
    balances: AccountSlice['balances'];
    currentIndex: number | null;
}

const UserBalance = () => {
    const { t } = useTranslation();

    const totalBalance = useSelector(selectTotalBalance);
    const stakingBalanceMetrics = useSelector(selectStakingBalance);
    const WSBashBalance = useSelector(selectWSBASHPrice);
    const BASHPrice = useSelector(selectFormattedBashBalance);

    const userBalances = [
        {
            key: 'stake:ValueOfYourBASH',
            value: BASHPrice,
        },
        {
            key: 'stake:ValueOfYourStakedBASH',
            value: WSBashBalance,
        },
        {
            key: 'stake:ValueOfYourNextRewardAmount',
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
                <Typography>
                    <> {totalBalance === null ? <Skeleton /> : totalBalance}</>
                </Typography>
            </Box>

            {balanceItems}
        </>
    );
};

export default UserBalance;
