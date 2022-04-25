import './loader.scss';
import CircularProgress from '@mui/material/CircularProgress';

function Loader() {
    return (
        <div className="loader-wrap">
            <CircularProgress size={120} color="inherit" />
        </div>
    );
}

export default Loader;
