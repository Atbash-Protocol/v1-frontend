import { forwardRef, RefObject, useState } from 'react';

import { Box, Snackbar, Alert } from '@mui/material';

import { theme } from 'constants/theme';
import { Message } from 'store/modules/messages/messages.types';

export const BSnackBar = forwardRef<RefObject<HTMLDivElement>, Message>(({ description, detailledDescription, severity }, ref) => {
    const [snackbarOpen, setSnackbarOpen] = useState(true);

    const handleClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box ref={ref} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }}>
            <Snackbar open={snackbarOpen} sx={{ position: 'relative' }}>
                <Alert variant="filled" severity={severity} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }} onClick={handleClose}>
                    {description}
                </Alert>
            </Snackbar>
        </Box>
    );
});
