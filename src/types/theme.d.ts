import '@mui/material/styles';

interface Background {
    dark: string;
}

declare module '@mui/material/styles' {
    interface Palette {
        cardBackground: Palette['primary'];
    }
    interface PaletteOptions {
        cardBackground: PaletteOptions['primary'];
    }
}
