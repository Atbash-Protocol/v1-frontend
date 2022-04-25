import { useState } from 'react';

import { Box, Grid, FormControl, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { theme } from 'constants/theme';
import { useSafeSigner } from 'lib/web3/web3.hooks';
import { approveBonds, calculateUserBondDetails, depositBond } from 'store/modules/bonds/bonds.thunks';
import { BondItem } from 'store/modules/bonds/bonds.types';
import AmountForm from 'views/Staking/components/AmountForm';

interface BondPurchaseProps {
    bond: BondItem;
}

const BondPurchase = ({ bond }: BondPurchaseProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { signer, signerAddress } = useSafeSigner();

    const [max, setMax] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [bondLoading, setBondLoading] = useState(false);

    const depositBondAction = () => {
        dispatch(depositBond({ amount: Number(quantity), signer, signerAddress, bond }));
    };

    const handleApproveClick = () => {
        dispatch(approveBonds({ signer, bond }));
    };

    const handleBondQuote = (amount: any) => {
        setQuantity(amount);
        dispatch(calculateUserBondDetails({ signer, signerAddress, bond }));
    };

    return (
        <Box sx={{ color: 'white' }}>
            <Grid container spacing={1}>
                <FormControl variant="outlined" color="primary" fullWidth></FormControl>
                <Grid xs={12}>
                    <AmountForm
                        initialValue={0}
                        maxValue={bond.metrics.balance || 0}
                        transactionType={'BASH_APPROVAL'}
                        approvesNeeded={!bond.metrics.allowance}
                        onApprove={handleApproveClick}
                        onAction={handleBondQuote}
                        approveLabel={t('bond:ZapinApproveToken', { token: bond.bondInstance.bondOptions.displayName })}
                        actionLabel={t('bond:MintPrice')}
                    />
                </Grid>

                <Grid xs={12}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: theme.palette.primary.main,
                            textAlign: 'center',
                            width: '100%',
                            p: theme.spacing(2),
                        }}
                        onClick={depositBondAction}
                    >
                        {t('bond:Mint')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BondPurchase;
