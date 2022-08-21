import { useMemo } from 'react';

import { Box, Skeleton, Typography } from '@mui/material';
import { isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

import { theme } from 'constants/theme';

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
                color: theme.palette.primary.light,
                [theme.breakpoints.up('xs')]: { fontSize: '.8rem' },
                [theme.breakpoints.up('sm')]: { fontSize: '1.3rem' },
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    width: '60%',
                }}
            >
                <>{t(metricKey)}</>
            </Typography>
            <Typography variant="body1" sx={{ width: '40%', textAlign: 'right' }}>
                {isNil(value) ? <Skeleton sx={{ width: '100%' }} /> : <>{value}</>}
            </Typography>
        </Box>
    );
};

const MemoInlineMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null | undefined }) =>
    useMemo(() => <InlineMetric {...{ metricKey, value }} />, [metricKey, value]);

export default MemoInlineMetric;
