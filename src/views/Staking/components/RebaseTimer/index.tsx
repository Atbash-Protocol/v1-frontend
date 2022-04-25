import { useState, useEffect } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { formatTimer } from 'helpers/prettify-seconds';
import { IReduxState } from 'store/slices/state.interface';

const RebaseTimer = () => {
    const { t } = useTranslation();

    const nextRebase = useSelector<IReduxState, number | undefined>(state => {
        if (state.main.staking.epoch) {
            return state.main.staking.epoch.endTime;
        }
    }, shallowEqual);
    const currentBlockTime = useSelector<IReduxState, number | null>(state => state.main.blockchain.timestamp);

    const [timeUntilRebase, setTimeUntilRebase] = useState<string | null>(null);

    useEffect(() => {
        if (currentBlockTime && nextRebase) {
            if (currentBlockTime > nextRebase) {
                setTimeUntilRebase(formatTimer(currentBlockTime, nextRebase, t));
            }
        }
    }, [currentBlockTime, nextRebase]);

    if (!currentBlockTime || !nextRebase) return <Skeleton />;

    return (
        <Box sx={{ color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: 2 }}>
            {timeUntilRebase ? <Typography>{t('TimeToNextRebase', { time: timeUntilRebase })}</Typography> : <Typography>{t('Rebasing')}</Typography>}
        </Box>
    );
};

export default RebaseTimer;
