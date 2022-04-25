import { useEffect } from 'react';

import { Box, Typography, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import Loading from 'components/Loader';
import { theme } from 'constants/theme';
import { useSafeSigner } from 'lib/web3/web3.hooks';
import { loadBalancesAndAllowances } from 'store/modules/account/account.thunks';
import { AccountSlice } from 'store/modules/account/account.types';
import { useContractLoaded } from 'store/modules/app/app.selectors';
import { MainSliceState } from 'store/modules/app/app.types';
import { selectStakingRewards } from 'store/modules/metrics/metrics.selectors';
import { IReduxState } from 'store/slices/state.interface';

import StakeMetrics from './components/Metrics';
import RebaseTimer from './components/RebaseTimer';
import Stake from './components/Stake';
import UserStakeMetrics from './components/Stake/StakeMetrics';
import UserBalance from './components/UserBalance';

function Staking() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { signerAddress } = useSafeSigner();

    const daiPrice = useSelector<IReduxState, number | null>(state => state.markets.markets.dai);
    const contractsLoaded = useSelector(useContractLoaded);
    const { loading, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew, shallowEqual);

    const { index: stakingIndex } = useSelector<IReduxState, MainSliceState['staking']>(state => state.main.staking, shallowEqual);

    const stakingMetrics = useSelector(selectStakingRewards);

    useEffect(() => {
        if (signerAddress && contractsLoaded) {
            dispatch(loadBalancesAndAllowances(signerAddress));
        }
    }, [signerAddress, contractsLoaded]);

    if (loading || !stakingMetrics) return <Loading />;

    return (
        <Box
            sx={{
                padding: {
                    xs: 0,
                    sm: 4,
                },
                marginRight: {
                    xs: 0,
                    sm: theme.spacing(4),
                },
            }}
        >
            <Zoom in={true}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.cardBackground.main,
                        backdropFilter: 'blur(100px)',
                        borderRadius: '.5rem',
                        color: theme.palette.primary.main,
                        p: { xs: 2, sm: 4 },
                    }}
                >
                    <Box sx={{ color: theme.palette.primary.main }}>
                        <Typography variant="h4" sx={{ textTransform: 'uppercase' }}>
                            <>{t('stake:StakeTitle')}</>
                        </Typography>
                        <RebaseTimer />
                    </Box>

                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <StakeMetrics />
                    </Box>
                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <Stake />
                    </Box>
                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <UserStakeMetrics />
                    </Box>
                </Box>
            </Zoom>

            <Zoom in={true}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.cardBackground.main,
                        marginTop: 4,
                        backdropFilter: 'blur(100px)',
                        borderRadius: '.5rem',
                        color: theme.palette.primary.main,
                        p: 4,
                    }}
                >
                    <UserBalance
                        stakingAPY={stakingMetrics.stakingAPY}
                        stakingRebase={stakingMetrics.stakingRebase}
                        daiPrice={daiPrice}
                        balances={balances}
                        currentIndex={stakingIndex}
                    />
                </Box>
            </Zoom>
        </Box>
    );
}

export default Staking;
