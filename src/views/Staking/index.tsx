import { useEffect } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { BCard } from 'components/BCard';
import { BMultiTabs } from 'components/BMultiTab/BMultiTab';
import Loading from 'components/Loader';
import { theme } from 'constants/theme';
import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectAccountLoading } from 'store/modules/account/account.selectors';
import { loadBalancesAndAllowances } from 'store/modules/account/account.thunks';
import { useContractLoaded } from 'store/modules/app/app.selectors';
import { selectStakingRewards } from 'store/modules/metrics/metrics.selectors';

import StakeMetrics from './components/Metrics';
import RebaseTimer from './components/RebaseTimer';
import { StakeCard } from './components/StakeAction';
import UserStakeMetrics from './components/StakeMetrics';
import { UnStakeCard } from './components/UnstakeAction';
import UserBalance from './components/UserBalance';

import './staking.scss';

const Staking = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { signerAddress } = useSafeSigner();

    const contractsLoaded = useSelector(useContractLoaded);

    useEffect(() => {
        if (signerAddress && contractsLoaded) {
            dispatch(loadBalancesAndAllowances(signerAddress));
        }
    }, [signerAddress, contractsLoaded]);

    const tabs = [
        { label: t('stake:Stake'), component: <StakeCard /> },
        { label: t('stake:Unstake'), component: <UnStakeCard /> },
    ];

    return (
        <>
            <BCard zoom title={t('stake:StakeTitle')}>
                <Box sx={{ color: theme.palette.primary.main }}>
                    <RebaseTimer />
                </Box>

                <Box sx={{ marginTop: theme.spacing(4) }}>
                    <StakeMetrics />
                </Box>
                <Box sx={{ marginTop: theme.spacing(4) }}>
                    <BMultiTabs tabs={tabs} />
                </Box>
                <Box sx={{ marginTop: theme.spacing(4) }}>
                    <UserStakeMetrics />
                </Box>
            </BCard>

            <BCard zoom title="" className="Staking__userBalance">
                <UserBalance />
            </BCard>
        </>
    );
};

const StakingLoader = () => {
    const accountsLoading = useSelector(selectAccountLoading);
    const stakingMetrics = useSelector(selectStakingRewards);

    if (accountsLoading || !stakingMetrics) return <Loading />;

    return <Staking />;
};

export default StakingLoader;
