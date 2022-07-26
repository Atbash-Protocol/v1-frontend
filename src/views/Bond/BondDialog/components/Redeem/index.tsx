import { useEffect } from 'react';

import { Box, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Loader from 'components/Loader';
import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { selectBondsReady, selectBondItemMetrics, selectBondRedeemMetrics, selectBondQuoteResult } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails, redeemBond } from 'store/modules/bonds/bonds.thunks';
import { BondMetrics } from 'store/modules/bonds/bonds.types';
import { selectIsRedeeming, selectIsRedeemingAndAutoStaking } from 'store/modules/transactions/transactions.selectors';
import { RootState } from 'store/store';

export const Redeem = ({ bondID, metrics, recipientAddress }: { bondID: string; metrics: BondMetrics; recipientAddress: string }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { bondDiscount, vestingTerm } = selectBondRedeemMetrics(metrics);

    const bondQuote = useSelector((state: RootState) => selectBondQuoteResult(state, t));
    const isClaiming = useSelector(selectIsRedeeming);
    const isClaimingAndStaking = useSelector(selectIsRedeemingAndAutoStaking);

    const {
        state: { networkID, signer },
    } = useWeb3Context();

    const bondMetrics = [
        { value: bondQuote.interestDue, metricKey: t('bond:PendingRewards') },
        { value: bondQuote.pendingPayout, metricKey: t('bond:PendingPayout') },
        { value: bondQuote.vesting, metricKey: t('bond:TimeFullyVested') },
        { value: bondDiscount, metricKey: t('ROI') },
        { value: t('common:day', { count: vestingTerm || 0 }), metricKey: t('bond:VestingTerm') },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    useEffect(() => {
        if (networkID) {
            dispatch(calcBondDetails({ bondID, value: 0, networkID }));
        }
    }, [networkID]);

    const handleClaim = ({ isAutoStake }: { isAutoStake: boolean }) => {
        if (signer) {
            dispatch(
                redeemBond({
                    recipientAddress,
                    bondID,
                    isAutoStake,
                    signer,
                }),
            );
        }
    };

    return (
        <Box>
            <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column', mb: theme.spacing(2) }}>
                <Box mt={theme.spacing(2)} width={'50%'} p={theme.spacing(2)}>
                    <Button sx={{ width: '5rem' }} onClick={() => handleClaim({ isAutoStake: false })}>
                        {isClaiming ? t('common:PendingEllipsis') : t('bond:Claim')}
                    </Button>
                </Box>

                <Box mt={theme.spacing(2)} width={'50%'} p={theme.spacing(2)}>
                    <Button sx={{ width: '5rem' }} onClick={() => handleClaim({ isAutoStake: true })}>
                        {isClaimingAndStaking ? t('common:PendingEllipsis') : t('bond:ClaimAutostake')}
                    </Button>
                </Box>
            </Box>

            <Divider variant="fullWidth" textAlign="center" sx={{ borderColor: theme.palette.primary.light, marginBottom: theme.spacing(2) }} />
            <Box>{bondMetrics}</Box>
        </Box>
    );
};

const RedeemLoader = ({ bondID, recipientAddress }: { bondID: string; recipientAddress: string }) => {
    const bondsReady = useSelector(selectBondsReady);
    const metrics = useSelector((state: RootState) => selectBondItemMetrics(state, bondID));

    if (!bondsReady) return <Loader />;
    return <Redeem bondID={bondID} metrics={metrics} recipientAddress={recipientAddress} />;
};

export default RedeemLoader;
