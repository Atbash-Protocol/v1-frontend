import { useMemo } from 'react';

import { Box, Skeleton, Typography, useMediaQuery } from '@mui/material';

import { theme } from 'constants/theme';

export const MenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    const isMobile = useMediaQuery(theme.breakpoints.up('xs'));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'left' : 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.primary.dark }}>
                {metricKey}
            </Typography>
            <Typography variant="h5" sx={{ overflow: 'hidden', wordBreak: 'break-all', overflowX: 'hidden', color: theme.palette.primary.main }}>
                {value === undefined ? <Skeleton sx={{ width: '100%' }} /> : <>{value}</>}
            </Typography>
        </Box>
    );
};

const MemoMenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    return useMemo(() => {
        return <MenuMetric {...{ metricKey, value }} />;
    }, [metricKey, value]);
};

export default MemoMenuMetric;
