import { useState, useEffect } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { formatTimer } from 'helpers/prettify-seconds';
import { useBlockchainInfos, useNextRebase } from 'store/modules/app/app.selectors';
import { getMarketPrices } from 'store/modules/markets/markets.thunks';

const RebaseTimer = () => {
    const { t } = useTranslation();

    const nextRebase = useSelector(useNextRebase);
    const dispatch = useDispatch();
    const { timestamp: currentBlockTime } = useSelector(useBlockchainInfos);

    const [timeUntilRebase, setTimeUntilRebase] = useState<string | null>(null);

    useEffect(() => {
        if (currentBlockTime && nextRebase) {
            if (currentBlockTime < nextRebase) {
                setTimeUntilRebase(formatTimer(currentBlockTime, nextRebase, t));
            }
        }

        setTimeout(() => {
            dispatch(getMarketPrices());
        }, 1000);
    }, [currentBlockTime, nextRebase]);

    if (!currentBlockTime || !nextRebase) return <Skeleton />;

    return (
        <Box sx={{ color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: 2 }}>
            <Typography>
                <>{timeUntilRebase ? t('TimeToNextRebase', { time: timeUntilRebase }) : t('Rebasing')}</>
            </Typography>
        </Box>
    );
};

export default RebaseTimer;
