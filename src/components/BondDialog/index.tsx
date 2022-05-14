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
import { formatUSD } from 'helpers/price-units';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectBondInstance, selectBondMetrics } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails, getBondTerms, getTreasuryBalance, loadBondBalancesAndAllowances } from 'store/modules/bonds/bonds.thunks';
import { RootState } from 'store/store';
import BondPurchase from 'views/Bond/actions/BondPurchase';
import { BondTest } from 'views/Bond/BondList/BondTest';
import BondMetrics from 'views/Bond/BondMetrics';

const BondDialog = ({ open, bondID }: { open: boolean; bondID: string }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        state: { signer, signerAddress, networkID },
    } = useWeb3Context();

    const onBackdropClick = () => history.goBack();

    const metrics = useSelector((state: RootState) => selectBondMetrics(state, bondID));
    const bond = useSelector((state: RootState) => selectBondInstance(state, bondID));

    const bashPrice = useSelector(selectFormattedReservePrice);

    useEffect(() => {
        if (isEmpty(metrics?.terms)) {
            dispatch(getBondTerms(bondID));
        }
    }, [metrics?.terms]);

    useEffect(() => {
        console.log('signer', signer, signerAddress);
        dispatch(loadBondBalancesAndAllowances({ address: signerAddress || '', bondID }));
        if (!bond) {
            dispatch(calcBondDetails({ bondID, value: 0 }));

            if (signer && signerAddress) {
            }
        }
    }, [bond, signer, signerAddress]);

    useEffect(() => {
        if (networkID) {
            dispatch(getTreasuryBalance({ networkID }));
        }
    }, [networkID]);

    //TODO: Add the custom settings : Slippage & Recipient address

    if (!bond || !metrics) return <Loader />;

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
                <BondLogo bondLogoPath={bond.bondOptions.iconPath} isLP={bond.isLP()} />

                <Typography variant="body1">{bond.bondOptions.displayName}</Typography>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Grid container item xs={12} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'treasuryBalance'} metricKey={t('TreasuryBalance')} value={formatUSD(metrics.treasuryBalance || 0, 2)} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'BashPrice'} metricKey={t('BASHPrice')} value={bashPrice} />
                        </Grid>
                    </Grid>
                </Box>

                {metrics?.allowance !== null && (
                    <Box>
                        <BondPurchase bondID={bondID} />
                        <Divider variant="fullWidth" textAlign="center" sx={{ borderColor: theme.palette.primary.light, marginBottom: theme.spacing(2) }} />
                        <BondTest />
                        <BondMetrics bondMetrics={metrics} />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BondDialog;
