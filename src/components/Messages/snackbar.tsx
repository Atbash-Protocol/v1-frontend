import { forwardRef, RefObject, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Snackbar, Alert, Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { theme } from 'constants/theme';
import { Message } from 'store/modules/messages/messages.types';

export const BSnackBar = forwardRef<RefObject<HTMLDivElement>, Message>(({ severity, description, detailledDescription }, ref) => {
    const [snackbarOpen, setSnackbarOpen] = useState(true);

    const handleClose = () => {
        setSnackbarOpen(false);
    };

    const hasDetailledDescription = !!detailledDescription;

    const expendIcon = hasDetailledDescription ? <ExpandMoreIcon /> : undefined;

    const MessageDetails = hasDetailledDescription ? (
        <AccordionDetails sx={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden' }} variant="body1" paragraph noWrap>
                {detailledDescription}
            </Typography>
        </AccordionDetails>
    ) : (
        <></>
    );

    return (
        <Box ref={ref} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }}>
            <Snackbar open={snackbarOpen} sx={{ position: 'relative' }}>
                <Alert variant="filled" severity={severity} sx={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2), alignItems: 'center' }}>
                    <Accordion
                        sx={{
                            boxShadow: 'none',
                            background: 'transparent',
                        }}
                    >
                        <AccordionSummary
                            sx={{
                                borderBottom: hasDetailledDescription ? '1px solid' : 'none',
                            }}
                            expandIcon={expendIcon}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Box onClick={handleClose}>
                                <CloseIcon color="primary" />
                            </Box>
                            <Typography>{description}</Typography>
                        </AccordionSummary>
                        {MessageDetails}
                    </Accordion>
                </Alert>
            </Snackbar>
        </Box>
    );
});
