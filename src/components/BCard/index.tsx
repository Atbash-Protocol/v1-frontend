import { Box, Typography, Zoom } from '@mui/material';

import { theme } from 'constants/theme';

export const BCard = ({ title, children, zoom, className }: { title: string; children: any; zoom: boolean; className?: string }) => {
    const card = (
        <Box
            className={className}
            sx={{
                padding: theme.spacing(4),
                marginRight: theme.spacing(4),
                '@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none)': {
                    background: theme.palette.cardBackground.main,
                    backdropFilter: 'blur(100px)',
                },

                '@supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none))': {
                    background: theme.palette.cardBackground.dark,
                    backdropFilter: 'blur(100px)',
                },
            }}
        >
            <Box sx={{ color: theme.palette.primary.main }}>
                <Typography variant="h4" sx={{ textTransform: 'uppercase' }}>
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    );

    return zoom ? (
        <Zoom>
            <>{card}</>
        </Zoom>
    ) : (
        card
    );
};
