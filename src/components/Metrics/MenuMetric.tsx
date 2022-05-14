import { useMemo } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';

import { theme } from 'constants/theme';

export const MenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                {metricKey}
            </Typography>
            <Typography variant="body1" sx={{ overflow: 'hidden', wordBreak: 'break-all', overflowX: 'hidden', color: theme.palette.primary.main }}>
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