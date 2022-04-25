import { useMemo } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const InlineMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null | undefined }) => {
    const { t } = useTranslation();

    return (
        <Box
            key={metricKey}
            sx={{
                display: 'inline-flex',
                width: '100%',
                justifyContent: 'space-between',
                p: {
                    xs: 0.5,
                    sm: 0.75,
                },
            }}
        >
            <Typography variant="body1">
                <>{t(metricKey)}</>
            </Typography>
            <Typography variant="body2">{value === undefined ? <Skeleton sx={{ width: '100%' }} /> : <>{value}</>}</Typography>
        </Box>
    );
};

const MemoInlineMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null | undefined }) =>
    useMemo(() => <InlineMetric {...{ metricKey, value }} />, [metricKey, value]);

export default MemoInlineMetric;
