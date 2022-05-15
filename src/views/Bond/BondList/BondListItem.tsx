import { useEffect } from 'react';

import { Box, Button, Grid, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import BondLogo from 'components/BondLogo';
import Loader from 'components/Loader';
import { theme } from 'constants/theme';
import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBondInstance, selectBondMetrics, selectBondMintingMetrics } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails } from 'store/modules/bonds/bonds.thunks';
import { IReduxState } from 'store/slices/state.interface';

interface IBondProps {
    bondID: string;
}

const BondMintMetric = ({ metric, value }: { metric: string; value: string | null }) => {
    return (
        <Grid
            item
            sm={2}
            xs={12}
            sx={{
                [theme.breakpoints.up('xs')]: {
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
            }}
        >
            <Box
                sx={{
                    [theme.breakpoints.up('xs')]: {
                        display: 'flex',
                    },
                    [theme.breakpoints.up('sm')]: {
                        display: 'none',
                    },
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

export const BondtListItem = ({ bondID }: IBondProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { signer } = useSafeSigner();

    const bond = useSelector((state: IReduxState) => selectBondInstance(state, bondID));
    const bondMetrics = useSelector((state: IReduxState) => selectBondMetrics(state, bondID));

    useEffect(() => {
        if (bond && bondMetrics) {
            dispatch(calcBondDetails({ bondID, value: 0 }));
        }
    }, [!bond || !bondMetrics]);

    if (!bond || !bondMetrics) return <Loader />;

    const { bondPrice, bondDiscount, purchased } = selectBondMintingMetrics(bondMetrics);
    const bondSoldOut = (bondMetrics.bondDiscount ?? 0) * 100 < -30;
    console.log('BondListItem', bond, purchased);

    const metrics = [
        { metric: t('bond:Mint'), value: bondPrice },
        {
            metric: t('Price'),
            value: bondDiscount,
        },
        { metric: t('ROI'), value: purchased },
    ].map((metric, i) => <BondMintMetric key={`bondMetric-${i}`} {...metric} />);

    return (
        <Grid
            container
            sx={{
                color: bondSoldOut ? theme.palette.primary.main : theme.palette.primary.main,
                [theme.breakpoints.up('xs')]: {
                    marginBottom: theme.spacing(2),
                    paddingBottom: theme.spacing(4),
                },
                [theme.breakpoints.up('sm')]: {
                    marginBottom: theme.spacing(0),
                    paddingBottom: theme.spacing(2),
                },
                alignItems: 'center',
            }}
        >
            <Grid item sm={1} xs={4}>
                <BondLogo bondLogoPath={bond.bondOptions.iconPath} isLP={bond.isLP()} />
            </Grid>
            <Grid item sm={2} xs={8}>
                <Typography variant="body1">{bond.bondOptions.displayName}</Typography>
            </Grid>
            {metrics}

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
                {signer && (
                    <Button disabled={!bond.bondOptions.isActive} sx={{ padding: `${theme.spacing(1)} ${theme.spacing(3)}`, cursor: 'pointer' }}>
                        <Link component={NavLink} to={`/mints/${bond.ID}`} sx={{ color: 'inherit', textDecoration: 'none' }}>
                            <Typography>
                                <>{bond.bondOptions.isActive ? t('bond:Mint') : t('bond:Redeem')}</>
                            </Typography>
                        </Link>
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};
