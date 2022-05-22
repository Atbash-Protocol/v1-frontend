import './bondlist.scss';
import { useEffect, useMemo } from 'react';

import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BCard } from 'components/BCard';
import { MenuMetric } from 'components/Metrics/MenuMetric';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { selectAllBonds, selectBondsReady, selectFormattedTreasuryBalance } from 'store/modules/bonds/bonds.selector';
import { getTreasuryBalance } from 'store/modules/bonds/bonds.thunks';
import { selectFormattedBashBalance } from 'store/modules/markets/markets.selectors';

import BondtListItem from './BondListItem';

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
    const bashPrice = useSelector(selectFormattedBashBalance);
    const treasuryBalance = useSelector(selectFormattedTreasuryBalance);
    const bondsReady = useSelector(selectBondsReady);

    useEffect(() => {
        if (networkID && bondsReady) {
            dispatch(getTreasuryBalance({ networkID }));
        }
    }, [networkID, bondsReady]);

    const ActiveBondList = useMemo(() => activeBonds.map(bond => <BondtListItem key={bond.ID} bondID={bond.ID} />), [activeBonds]);
    const InactiveBondList = useMemo(() => inactiveBonds.map(bond => <BondtListItem key={bond.ID} bondID={bond.ID} />), [inactiveBonds]);

    return (
        <>
            <BCard title={t('bond:MintTitle')} zoom={true}>
                <Box>
                    <Grid container item xs={12} spacing={2} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'treasuryBalance'} metricKey={t('TreasuryBalance')} value={treasuryBalance} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={'BashPrice'} metricKey={t('BASHPrice')} value={bashPrice} />
                        </Grid>
                    </Grid>
                    <Grid container item>
                        <BondHeader />

                        {ActiveBondList}
                    </Grid>
                </Box>
            </BCard>

            <BCard title={t('bond:MintInactiveTitle')} zoom={true} className="BondList__card">
                <Box>
                    <Grid container item>
                        <BondHeader />
                        {InactiveBondList}
                    </Grid>
                </Box>
            </BCard>
        </>
    );
}

export default BondList;
