import { Box, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { BMultiTabs } from 'components/BMultiTab/BMultiTab';
import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import MenuMetric from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectBondInstance, selectBondMetricsReady, selectBondPrice } from 'store/modules/bonds/bonds.selector';
import { Bond } from 'store/modules/bonds/bonds.types';
import { RootState } from 'store/store';

import { Mint } from './components/Mint';
import { Redeem } from './components/Redeem';

/**
 *
 * TODO :
 * - create mint view
 *  - add buttons
 *   + approve form
 *  - add custom slippage
 * - create redeem view
 *     - claim + claim and autostake
 */

const BondDetails = ({ open, bondID, bond }: { open: boolean; bondID: string; bond: Bond }) => {
    const history = useHistory();

    const onBackdropClick = () => history.goBack();

    const bashPrice = useSelector(selectFormattedReservePrice);
    const bondPrice = useSelector((state: RootState) => selectBondPrice(state, bondID));

    //TODO: Add the custom settings : Slippage & Recipient address

    const bondActions = [
        {
            label: t('mint:Mint'),
            component: <Mint bondID={bondID} />,
        },
        {
            label: t('mint:Redeem'),
            component: <Redeem bondID={bondID} />,
        },
    ];

    return (
        <Dialog
            {...{
                onBackdropClick,
                open,
                maxWidth: 'xl',
                fullWidth: true,
                PaperProps: { sx: { background: theme.palette.cardBackground.light, color: theme.palette.primary.dark } },
            }}
            sx={{
                p: 4,
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
                            <MenuMetric key={'MintPrice'} metricKey={t('bond:MintPrice')} value={bondPrice} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'BashPrice'} metricKey={t('BASHPrice')} value={bashPrice} />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <BMultiTabs tabs={bondActions} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

const BondDialogLoader = ({ open, bondID }: { open: boolean; bondID: string }) => {
    const metrics = useSelector((state: RootState) => selectBondMetricsReady(state, bondID));
    const bond = useSelector((state: RootState) => selectBondInstance(state, bondID));

    if (!metrics || !bond) return <Loader />;

    return <BondDetails open={open} bondID={bondID} bond={bond} />;
};

export default BondDialogLoader;
