import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function Loader() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={120} />
        </Box>
    );
}

export default Loader;
