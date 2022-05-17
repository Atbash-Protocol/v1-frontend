import { useEffect } from 'react';

import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import MenuMetric from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { formatUSD } from 'helpers/price-units';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectBondInstance, selectBondMetrics } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails, getBondTerms, getTreasuryBalance, loadBondBalancesAndAllowances } from 'store/modules/bonds/bonds.thunks';
import { BondMetrics } from 'store/modules/bonds/bonds.types';
import { RootState } from 'store/store';
import BondPurchase from 'views/Bond/actions/BondPurchase';
import BondDetailsMetrics from 'views/Bond/BondMetrics';

const BondDetails = ({ open, bondID, bond, metrics }: { open: boolean; bondID: string; bond: LPBond | StableBond; metrics: BondMetrics }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        state: { signer, signerAddress, networkID },
    } = useWeb3Context();

    const onBackdropClick = () => history.goBack();

    const bashPrice = useSelector(selectFormattedReservePrice);
    console.log('here', dispatch);

    useEffect(() => {
        if (!metrics?.terms) {
            console.log('here2');
            dispatch(getBondTerms(bondID));
        }
    }, [metrics?.terms]);

    console.log('bdetails', dispatch, calcBondDetails);

    useEffect(() => {
        if (bondID) {
            dispatch(calcBondDetails({ bondID, value: 0 }));

            if (signer && signerAddress) {
                dispatch(loadBondBalancesAndAllowances({ address: signerAddress || '', bondID }));
            }
        }
    }, [bondID, signer, signerAddress]);

    useEffect(() => {
        if (networkID) {
            dispatch(getTreasuryBalance({ networkID }));
        }
    }, [networkID]);

    //TODO: Add the custom settings : Slippage & Recipient address

    return (
        <Dialog
            {...{
                onBackdropClick,
                open,
                maxWidth: 'sm',
                fullWidth: true,
                PaperProps: { sx: { background: theme.palette.cardBackground.light, color: theme.palette.primary.dark } },
            }}
            sx={{
                p: 2,
                [theme.breakpoints.up('xs')]: {
                    p: 0,
                },
                backdropFilter: 'blur(10px)',
            }}
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

                {metrics.allowance !== null && (
                    <Box>
                        <BondPurchase bondID={bondID} />
                        <Divider variant="fullWidth" textAlign="center" sx={{ borderColor: theme.palette.primary.light, marginBottom: theme.spacing(2) }} />
                        <BondDetailsMetrics bondMetrics={metrics} />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

const BondDialogLoader = ({ open, bondID }: { open: boolean; bondID: string }) => {
    const metrics = useSelector((state: RootState) => selectBondMetrics(state, bondID));
    const bond = useSelector((state: RootState) => selectBondInstance(state, bondID));

    if (!metrics || !bond) return <Loader />;

    console.log('bond dialog', metrics, bond);

    return <BondDetails open={open} bondID={bondID} bond={bond} metrics={metrics} />;
};

export default BondDialogLoader;
