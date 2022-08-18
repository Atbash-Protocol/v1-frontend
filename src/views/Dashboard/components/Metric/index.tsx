import { Skeleton, Typography } from '@mui/material';

export interface MetricProps {
    name: string;
    value?: unknown;
    loading: boolean;
}

export const Metric = ({ name, value, loading }: MetricProps): JSX.Element => {
    return (
        <>
            <Typography variant="h5">{name}</Typography>
            <Typography sx={{ overflowX: 'hidden' }} variant="h6">
                {loading ? <Skeleton /> : <>{value}</>}
            </Typography>
        </>
    );
};
