import './bondlist.scss';
import { useEffect } from 'react';

import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BCard } from 'components/BCard';
import { MenuMetric } from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { formatUSD } from 'helpers/price-units';
import { useContractLoaded } from 'store/modules/app/app.selectors';
import { selectAllBonds } from 'store/modules/bonds/bonds.selector';
import { calcBondDetails, getTreasuryBalance } from 'store/modules/bonds/bonds.thunks';
import { selectDAIPrice } from 'store/modules/markets/markets.selectors';
import { IReduxState } from 'store/slices/state.interface';

import { BondtListItem } from './BondListItem';

const BondHeader = () => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            sx={{
                [theme.breakpoints.up('xs')]: {
                    display: 'none',
                },
                [theme.breakpoints.up('sm')]: {
                    display: 'inline-flex',
                },
                color: theme.palette.primary.main,
            }}
        >
            <Grid item sm={1} />
            <Grid item sm={2}>
                <Typography variant="h6">
                    <>{t('bond:Mint')}</>
                </Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">
                    <>{t('Price')}</>
                </Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">
                    <>{t('ROI')}</>
                </Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">
                    <>{t('bond:Purchased')}</>
                </Typography>
            </Grid>
            <Grid item sm={2} />
        </Grid>
    );
};

function BondList() {
    const { t } = useTranslation();

    const {
        state: { networkID },
    } = useWeb3Context();
    const dispatch = useDispatch();

    const { activeBonds, inactiveBonds } = useSelector(selectAllBonds);
    const contractsLoaded = useSelector(useContractLoaded);
    const marketPrice = useSelector<IReduxState, number | null>(selectDAIPrice);
    const treasuryBalance = useSelector<IReduxState, number | null>(state => state.bonds.treasuryBalance);
    const loadedBonds = useSelector<IReduxState, boolean>(state => Object.values(state.bonds.bonds).length > 0);

    const isAppLoading = !marketPrice || !treasuryBalance;

    useEffect(() => {
        if (networkID && contractsLoaded && loadedBonds) {
            dispatch(getTreasuryBalance(networkID));
        }
    }, [networkID, contractsLoaded, loadedBonds]);

    useEffect(() => {
        if (!isAppLoading) {
            [...activeBonds, ...inactiveBonds].map(bond => {
                dispatch(calcBondDetails({ bond, value: 0 }));
            });
        }
    }, [isAppLoading]);

    return (
        <>
            <BCard title={t('bond:MintTitle')} zoom={true}>
                <Box>
                    <Grid container item xs={12} spacing={2} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'treasuryBalance'} metricKey={t('TreasuryBalance')} value={treasuryBalance ? formatUSD(treasuryBalance) : null} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'BashPrice'} metricKey={t('BASHPrice')} value={marketPrice ? formatUSD(marketPrice, 2) : null} />
                        </Grid>
                    </Grid>
                    <Grid container item>
                        <BondHeader />

                        {activeBonds.map(bond => (
                            <BondtListItem key={bond.ID} bondID={bond.ID} />
                        ))}
                    </Grid>
                </Box>
            </BCard>

            <BCard title={t('bond:MintInactiveTitle')} zoom={true} className="BondList__card">
                <Box>
                    <Grid container item>
                        <BondHeader />
                        {inactiveBonds.map(bond => (
                            <BondtListItem key={bond.ID} bondID={bond.ID} />
                        ))}
                    </Grid>
                </Box>
            </BCard>
        </>
    );
}

export default BondList;
