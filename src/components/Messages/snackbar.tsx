import { forwardRef, RefObject, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Snackbar, Alert, Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { theme } from 'constants/theme';
import { Message } from 'store/modules/messages/messages.types';

export const BSnackBar = forwardRef<RefObject<HTMLDivElement>, Message>(({ severity }, ref) => {
    const [snackbarOpen, setSnackbarOpen] = useState(true);

    const handleClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box ref={ref} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }}>
            <Snackbar open={snackbarOpen} sx={{ position: 'relative' }}>
                <Alert variant="filled" severity={severity} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }} onClick={handleClose}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            <Typography>Accordion 1</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</Typography>
                        </AccordionDetails>
                    </Accordion>

                    {/* {description} */}
                </Alert>
            </Snackbar>
        </Box>
    );
});
