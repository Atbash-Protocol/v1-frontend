import { darkScrollbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: grey.A100,
        },
        secondary: {
            main: grey[500],
        },
        cardBackground: {
            main: 'rgba(0,1,40,.5)',
            dark: 'rgba(0, 1, 40, 0.9)',
            light: 'rgba(5,8,24,0.77)',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-root': {
                        background: '#C3F53C',
                        color: 'rgba(0, 1, 40, 0.9)',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 0,
                        borderRadius: 0,
                    },
                    '&.MuiButton-root.Mui-disabled': {
                        color: grey[500],
                    },
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    '&.MuiSkeleton-root': {
                        background: '#2d2f3ac2',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.MuiTab-root': {
                        color: grey.A100,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '&.MuiPaper-root': {
                        borderRight: 'none',
                    },
                },
            },
        },
    },
});
