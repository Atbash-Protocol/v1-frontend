import { useContext, useEffect, useRef, useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Dialog, DialogContent, DialogTitle, Grid, Slide, Typography } from '@mui/material';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { BMultiTabs } from 'components/BMultiTab/BMultiTab';
import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import MenuMetric from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { Web3Context } from 'contexts/web3/web3.context';
import { selectFormattedReservePrice } from 'store/modules/app/app.selectors';
import { selectBondInstance, selectBondMetricsReady, selectBondPrice } from 'store/modules/bonds/bonds.selector';
import { calculateUserBondDetails, loadBondBalancesAndAllowances } from 'store/modules/bonds/bonds.thunks';
import { Bond } from 'store/modules/bonds/bonds.types';
import { RootState } from 'store/store';

import AdvancedSettings from './components/AdvancedSettings';
import Mint from './components/Mint';
import Redeem from './components/Redeem';

interface BondDialogProps {
    open: boolean;
    bondID: string;
    bond: Bond;
}

const BondDialog = ({ open, bondID, bond }: BondDialogProps) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onBackdropClick = () => history.goBack();

    const {
        state: { signer, signerAddress },
    } = useContext(Web3Context);

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    const bashPrice = useSelector(selectFormattedReservePrice);
    const bondPrice = useSelector((state: RootState) => selectBondPrice(state, bondID));

    const [slippage, setSlippage] = useState(0.5);
    const [recipientAddress, setRecipientAddress] = useState(signerAddress);

    const handleAdvancedSettingsClick = () => {
        setShowAdvancedSettings(settings => !settings);
    };

    const handleSettingsChange = (args: { recipientAddress: string; slippage: number }) => {
        if (slippage !== args.slippage) setSlippage(args.slippage);

        if (recipientAddress !== args.recipientAddress) setRecipientAddress(args.recipientAddress);
    };

    const containerRef = useRef(null);

    const bondActions = [
        {
            label: t('mint:Mint'),
            component: <Mint bondID={bondID} slippage={slippage} recipientAddress={recipientAddress ?? ''} />,
        },
        {
            label: t('mint:Redeem'),
            component: <Redeem bondID={bondID} recipientAddress={recipientAddress ?? ''} />,
        },
    ];

    useEffect(() => {
        if (signerAddress) {
            dispatch(loadBondBalancesAndAllowances({ address: signerAddress, bondID }));
        }
    }, [signerAddress]);

    useEffect(() => {
        if (signer && signerAddress) {
            dispatch(calculateUserBondDetails({ signer, signerAddress, bondID }));
        }
    }, [signer, signerAddress]);

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
            <DialogTitle sx={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', gap: theme.spacing(1) }}>
                <Grid container>
                    <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <BondLogo bondLogoPath={bond.bondOptions.iconPath} isLP={bond.isLP()} />
                        <Typography variant="body1">{bond.bondOptions.displayName}</Typography>
                    </Grid>

                    <Grid item xs={2} onClick={handleAdvancedSettingsClick} sx={{ textAlign: 'right' }}>
                        <SettingsIcon />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent sx={{ position: 'relative', minHeight: '40rem', [theme.breakpoints.only('xs')]: { padding: theme.spacing(1) } }}>
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <Box
                        sx={{
                            [theme.breakpoints.only('xs')]: { paddingRight: theme.spacing(1) },
                            position: 'absolute',
                            width: '100%',
                            opacity: showAdvancedSettings ? 0.1 : 1,
                        }}
                    >
                        <Box sx={{ [theme.breakpoints.only('xs')]: { paddingRight: theme.spacing(1) } }}>
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
                    </Box>
                    <Box
                        sx={{
                            overflow: 'hidden',
                            position: 'absolute',
                            width: showAdvancedSettings ? '100%' : '0',
                            height: '25rem',
                            [theme.breakpoints.only('xs')]: { paddingRight: theme.spacing(1) },
                        }}
                        ref={containerRef}
                    >
                        <Slide direction="left" in={showAdvancedSettings === true} mountOnEnter unmountOnExit timeout={300} container={containerRef.current}>
                            <Grid item xs={12} sx={{ paddingBottom: theme.spacing(1), paddingTop: theme.spacing(1), height: '100%' }}>
                                <AdvancedSettings
                                    slippage={slippage}
                                    recipientAddress={recipientAddress ?? ''}
                                    handleChange={handleSettingsChange}
                                    handleClose={() => setShowAdvancedSettings(false)}
                                />
                            </Grid>
                        </Slide>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

const BondDialogLoader = ({ open, bondID }: { open: boolean; bondID: string }) => {
    const metrics = useSelector((state: RootState) => selectBondMetricsReady(state, bondID));
    const bond = useSelector((state: RootState) => selectBondInstance(state, bondID));

    if (!metrics || !bond) return <Loader />;

    return <BondDialog open={open} bondID={bondID} bond={bond} />;
};

export default BondDialogLoader;
