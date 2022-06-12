import { useState, useEffect } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { formatTimer } from 'helpers/prettify-seconds';
import { useBlockchainInfos, useNextRebase } from 'store/modules/app/app.selectors';

const RebaseTimer = () => {
    const { t } = useTranslation();

    const nextRebase = useSelector(useNextRebase);
    const { timestamp: currentBlockTime } = useSelector(useBlockchainInfos);

    const [timeUntilRebase, setTimeUntilRebase] = useState<string | null>(null);

    useEffect(() => {
        if (currentBlockTime && nextRebase) {
            if (currentBlockTime < nextRebase) {
                setTimeUntilRebase(formatTimer(currentBlockTime, nextRebase, t));
            }
        }
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
