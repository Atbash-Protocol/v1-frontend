import { Box } from '@mui/material';

interface IBondLogoProps {
    bondLogoPath: string;
    isLP: boolean;
}

function BondLogo({ bondLogoPath, isLP }: IBondLogoProps) {
    let style = { height: '32px', width: '32px' };

    if (isLP) {
        style = { height: '32px', width: '62px' };
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width={'64px'}>
            <img src={bondLogoPath} style={style} />
        </Box>
    );
}

export default BondLogo;
