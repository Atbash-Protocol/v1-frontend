import MenuIcon from "@mui/icons-material/Menu";

import AtbashMenu from "./atbash-menu";
import ConnectButton from "./connect-button";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { theme } from "constants/theme";

interface IHeader {
    handleDrawerToggle: () => void;
    isSmallScreen: boolean;
}

function Header({ handleDrawerToggle, isSmallScreen }: IHeader) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                color="transparent"
                position="sticky"
                sx={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    position: "relative",
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar
                    sx={{
                        background: "transparent",
                    }}
                >
                    {isSmallScreen && (
                        <IconButton onClick={handleDrawerToggle} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <AtbashMenu />
                    <ConnectButton />
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
