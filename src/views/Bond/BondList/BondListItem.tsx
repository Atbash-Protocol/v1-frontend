import { useEffect } from 'react';

import { Box, Button, Grid, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { useSignerConnected } from 'contexts/web3/web3.hooks';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { selectBondInstance, selectBondItemMetrics, selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails } from 'store/modules/bonds/bonds.thunks';
import { BondMetrics } from 'store/modules/bonds/bonds.types';
import { IReduxState } from 'store/slices/state.interface';

interface IBondProps {
    bondID: string;
    metrics: BondMetrics;
    bond: LPBond | StableBond;
    networkID: number;
}

const BondMintMetric = ({ metric, value }: { metric: string; value: string | null }) => {
    return (
        <Grid
            item
            sm={2}
            xs={12}
            sx={{
                [theme.breakpoints.up('xs')]: { display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center' },
            }}
        >
            <Box
                sx={{
                    [theme.breakpoints.up('xs')]: { display: 'flex' },
                    [theme.breakpoints.up('sm')]: { display: 'none' },
                }}
            >
                <Typography variant="body1">{metric}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                {!value && <Skeleton />}
                {value && <Typography variant="h6">{value}</Typography>}
            </Box>
        </Grid>
    );
};

const BondtListItem = ({ bondID, bond, metrics, networkID }: IBondProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const signerConnected = useSignerConnected();

    useEffect(() => {
        if (!bond && !metrics) {
            dispatch(calcBondDetails({ bondID, value: 0, networkID }));
        }
    }, [bond, metrics]);

    const { bondPrice, bondDiscount, purchased, bondSoldOut } = selectBondMintingMetrics(metrics);

    const bondMetrics = [
        { metric: t('bond:Mint'), value: bondPrice },
        { metric: t('Price'), value: bondDiscount },
        { metric: t('ROI'), value: purchased },
    ].map((metric, i) => <BondMintMetric key={`bondMetric-${i}`} {...metric} />);

    return (
        <Grid
            container
            sx={{
                color: bondSoldOut ? theme.palette.primary.main : theme.palette.primary.main,
                [theme.breakpoints.up('xs')]: { marginBottom: theme.spacing(2), paddingBottom: theme.spacing(4) },
                [theme.breakpoints.up('sm')]: { marginBottom: theme.spacing(0), paddingBottom: theme.spacing(2) },
                alignItems: 'center',
            }}
        >
            <Grid item sm={1} xs={4}>
                <BondLogo bondLogoPath={bond.bondOptions.iconPath} isLP={bond.isLP()} />
            </Grid>
            <Grid item sm={2} xs={8}>
                <Typography variant="body1">{bond.bondOptions.displayName}</Typography>
            </Grid>
            {bondMetrics}

            <Grid
                item
                sm={3}
                sx={{
                    border: '1px solid',
                    [theme.breakpoints.down('xs')]: {
                        display: 'none',
                    },
                }}
            >
                {signerConnected && (
                    <Button disabled={false} sx={{ padding: `${theme.spacing(1)} ${theme.spacing(3)}`, cursor: 'pointer' }}>
                        <Link component={NavLink} to={`/bond/${bondID}`} sx={{ color: 'inherit', textDecoration: 'none' }}>
                            <Typography>
                                <>{bond.bondOptions.isActive ? t('bond:MintBond', { bond: bondID }) : t('bond:RedeemBond', { bond: bondID })}</>
                            </Typography>
                        </Link>
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

const BondListItemLoader = ({ bondID }: { bondID: string }) => {
    const bond = useSelector((state: IReduxState) => selectBondInstance(state, bondID));
    const metrics = useSelector((state: IReduxState) => selectBondItemMetrics(state, bondID));
    const {
        state: { networkID },
    } = useWeb3Context();

    if (!metrics || !bond || !networkID) return <Loader />;

    return <BondtListItem bondID={bondID} bond={bond} metrics={metrics} networkID={networkID} />;
};

export default BondListItemLoader;
