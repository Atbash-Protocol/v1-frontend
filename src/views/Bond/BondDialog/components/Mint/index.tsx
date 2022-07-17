import { Box, Divider } from '@mui/material';

import { theme } from 'constants/theme';

import BondPurchase from '../BondPurchase';

export const Mint = ({ bondID }: { bondID: string }) => {
    return (
        <Box>
            <BondPurchase bondID={bondID} />
            <Divider variant="fullWidth" textAlign="center" sx={{ borderColor: theme.palette.primary.light, marginBottom: theme.spacing(2) }} />
            {/* <BondDetailsMetrics bondMetrics={metrics} /> */}
        </Box>
    );
};
