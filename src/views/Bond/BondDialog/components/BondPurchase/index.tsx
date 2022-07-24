import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBondInstance, selectBondItemMetrics } from 'store/modules/bonds/bonds.selector';
import { approveBonds, depositBond } from 'store/modules/bonds/bonds.thunks';
import { RootState } from 'store/store';
import AmountForm from 'views/Staking/components/AmountForm';

const BondPurchase = ({ bondID }: { bondID: string }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { signer, signerAddress } = useSafeSigner();

    const bondMetrics = useSelector((state: RootState) => selectBondItemMetrics(state, bondID));
    const bondInstance = useSelector((state: RootState) => selectBondInstance(state, bondID));

    const depositBondAction = (amount: number) => {
        dispatch(depositBond({ amount, signer, signerAddress, bondID }));
    };

    const handleApproveClick = () => {
        dispatch(approveBonds({ signer, bondID }));
    };

    return (
        <Box sx={{ color: 'white', marginBottom: 2, paddingBottom: 2 }}>
            <Grid container>
                <Grid item xs={12}>
                    <AmountForm
                        initialValue={0}
                        maxValue={bondMetrics?.balance || 0}
                        transactionType={'BASH_APPROVAL'}
                        approvesNeeded={!bondMetrics?.allowance}
                        onApprove={handleApproveClick}
                        onAction={depositBondAction}
                        approveLabel={t('bond:ZapinApproveToken', { token: bondInstance ? bondInstance.bondOptions.displayName : '' })}
                        actionLabel={t('bond:Mint')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default BondPurchase;
