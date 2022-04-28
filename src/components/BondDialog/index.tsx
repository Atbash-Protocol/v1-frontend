import { useEffect } from 'react';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import MenuMetric from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { useBondPurchaseReady, selectBondReady } from 'hooks/bonds';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails, getBondTerms, loadBondBalancesAndAllowances } from 'store/modules/bonds/bonds.thunks';
import { BondItem } from 'store/modules/bonds/bonds.types';
import BondPurchase from 'views/Bond/actions/BondPurchase';
import BondMetrics from 'views/Bond/BondMetrics';

// Ajouter une surcouche qui gère le dialog + le chargement du bond avec le router

const BondDialog = ({ open, bond }: { open: boolean; bond: BondItem }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        state: { signer, signerAddress },
    } = useWeb3Context();

    const onBackdropClick = () => history.goBack();

    const metrics = selectBondMintingMetrics(bond.metrics);
    const bondIsReady = selectBondReady(bond);
    const selectAppReadyForBondCalculation = useBondPurchaseReady();

    const bashPrice = useSelector(selectFormattedReservePrice);

    useEffect(() => {
        if (isEmpty(bond.terms)) {
            dispatch(getBondTerms(bond));
        }
    }, [bond.terms]);

    useEffect(() => {
        if (!bondIsReady && selectAppReadyForBondCalculation) {
            dispatch(calcBondDetails({ bond: bond.bondInstance, value: 0 }));

            if (signer && signerAddress) {
                dispatch(loadBondBalancesAndAllowances({ address: signerAddress }));
            }
        }
    }, [bondIsReady, signer, signerAddress, selectAppReadyForBondCalculation]);

    //TODO: Add the custom settings : Slippage & Recipient address

    if (!bondIsReady || !selectAppReadyForBondCalculation) return <Loader />;

    return (
        <Dialog
            {...{
                onBackdropClick,
                open,
                maxWidth: 'sm',
                fullWidth: true,
                PaperProps: { sx: { background: theme.palette.cardBackground.light, color: theme.palette.primary.dark } },
            }}
            sx={{ p: 2, backdropFilter: 'blur(10px)' }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing(1) }}>
                <BondLogo bondLogoPath={bond.bondInstance.bondOptions.iconPath} isLP={bond.bondInstance.isLP()} />

                <Typography variant="body1">{bond.bondInstance.bondOptions.displayName}</Typography>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Grid container item xs={12} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'treasuryBalance'} metricKey={t('TreasuryBalance')} value={metrics.bondPrice} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'BashPrice'} metricKey={t('BASHPrice')} value={bashPrice} />
                        </Grid>
                    </Grid>
                </Box>

                {metrics.allowance !== null && (
                    <Box>
                        <BondPurchase bond={bond} />
                        <Divider />
                        <BondMetrics bondMetrics={bond.metrics} />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BondDialog;
