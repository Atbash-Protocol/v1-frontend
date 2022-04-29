import { useRef, useState } from 'react';

import { Box, Grid, Button, Slide } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MemoInlineMetric from 'components/Metrics/InlineMetric';
import { theme } from 'constants/theme';
import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBondQuoteResult } from 'store/modules/bonds/bonds.selector';
import { approveBonds, calculateUserBondDetails, depositBond } from 'store/modules/bonds/bonds.thunks';
import { BondItem } from 'store/modules/bonds/bonds.types';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';
import AmountForm from 'views/Staking/components/AmountForm';

interface BondPurchaseProps {
    bond: BondItem;
}

const BondPurchase = ({ bond }: BondPurchaseProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { signer, signerAddress } = useSafeSigner();

    const bondIsLoading = useSelector<IReduxState, boolean>(state => state.bonds.loading);
    const bondIsQuoting = useSelector<IReduxState, boolean>(state => state.bonds.bondQuoting);
    const bondQuoteResult = useSelector(state => selectBondQuoteResult(state as RootState, t));

    const [quantity, setQuantity] = useState('');

    const depositBondAction = () => {
        dispatch(depositBond({ amount: Number(quantity), signer, signerAddress, bond }));
    };

    const handleApproveClick = () => {
        dispatch(approveBonds({ signer, bond }));
    };

    const handleBondQuote = (amount: number) => {
        if (amount > 0) {
            setQuantity(amount.toString());
            console.log(quantity.length > 0);
            dispatch(calculateUserBondDetails({ signer, signerAddress, bond }));
        }
    };

    const containerRef = useRef(null);

    return (
        <Box sx={{ color: 'white', marginBottom: 2, paddingBottom: 2 }}>
            <Grid container>
                <Grid item xs={12}>
                    <AmountForm
                        initialValue={0}
                        maxValue={bond.metrics.balance || 0}
                        transactionType={'BASH_APPROVAL'}
                        approvesNeeded={!bond.metrics.allowance}
                        onApprove={handleApproveClick}
                        onAction={handleBondQuote}
                        approveLabel={t('bond:ZapinApproveToken', { token: bond.bondInstance.bondOptions.displayName })}
                        actionLabel={t('bond:Quote')}
                    />
                </Grid>

                <Grid item xs={12} ref={containerRef} sx={{ overflow: 'hidden' }}>
                    <Slide direction="down" in={quantity.length > 0} mountOnEnter unmountOnExit container={containerRef.current} timeout={300}>
                        <Grid item xs={12} sx={{ paddingBottom: theme.spacing(1), paddingTop: theme.spacing(1) }}>
                            <MemoInlineMetric metricKey={t('bond:InterestDue')} value={bondQuoteResult.interestDue} />
                            <MemoInlineMetric metricKey={t('bond:PendingPayout')} value={bondQuoteResult.pendingPayout} />
                            <MemoInlineMetric metricKey={t('bond:Vesting')} value={bondQuoteResult.vesting} />
                        </Grid>
                    </Slide>
                </Grid>
                <Grid item xs={12} mt={theme.spacing(2)}>
                    <Button
                        variant="outlined"
                        disabled={quantity.length === 0 || bondIsQuoting || bondIsLoading}
                        sx={{
                            color: theme.palette.primary.main,
                            textAlign: 'center',
                            width: '100%',
                            p: theme.spacing(2),
                        }}
                        onClick={depositBondAction}
                    >
                        <>{t('bond:Mint')}</>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BondPurchase;
