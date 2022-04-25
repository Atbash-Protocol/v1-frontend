import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { formatNumber, formatUSD } from 'helpers/price-units';
import { AccountSlice } from 'store/modules/account/account.types';
import { selectFormattedBashBalance } from 'store/modules/markets/markets.selectors';
import { selectTotalBalance } from 'store/modules/metrics/metrics.selectors';
import { IReduxState } from 'store/slices/state.interface';

interface UserBalanceProps {
    stakingAPY: number;
    stakingRebase: number;
    daiPrice: number | null;
    balances: AccountSlice['balances'];
    currentIndex: number | null;
}

const UserBalance = ({ stakingAPY, stakingRebase, balances, currentIndex }: UserBalanceProps) => {
    const { t } = useTranslation();

    const daiPrice = useSelector<IReduxState, number>(state => state.markets.markets.dai || 0);

    const totalBalance = useSelector(selectTotalBalance);

    const nextRewardValue = stakingRebase * balances.SBASH.toNumber();
    const wrappedTokenEquivalent = balances.SBASH.toNumber() * Number(currentIndex);
    const effectiveNextRewardValue = (nextRewardValue + stakingRebase) * wrappedTokenEquivalent * daiPrice;
    const BASHPrice = useSelector(selectFormattedBashBalance);

    const userBalances = [
        {
            key: 'stake:ValueOfYourBASH',
            value: BASHPrice,
        },
        {
            key: 'stake:ValueOfYourStakedBASH',
            value: formatUSD(balances.WSBASH.toNumber() * daiPrice),
        },
        {
            key: 'stake:ValueOfYourNextRewardAmount',
            value: formatUSD(balances.SBASH.toNumber() * stakingAPY),
        },
        {
            key: 'stake:ValueOfYourEffectiveNextRewardAmount',
            value: formatNumber(effectiveNextRewardValue, 2),
        },
        {
            key: 'stake:ValueOfYourWrappedStakedSB',
            value: formatNumber(balances.SBASH.toNumber() * daiPrice * Number(currentIndex)),
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
                    <> {totalBalance === null ? <Skeleton /> : formatUSD(totalBalance, 2)}</>
                </Typography>
            </Box>

            {balanceItems}
        </>
    );
};

export default UserBalance;
