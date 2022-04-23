import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
// import MenuIcon from "../../assets/icons/hamburger.svg";
import MenuIcon from "@mui/icons-material/Menu";

import AtbashMenu from "./atbash-menu";
import ConnectButton from "./connect-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "constants/styles";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
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
        // <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
        //     <AppBar position="sticky" className={classes.appBar} elevation={0}>
        //         <Toolbar className="dapp-topbar">
        //             <div onClick={handleDrawerToggle} className="dapp-topbar-slider-btn">
        //                 <img src={MenuIcon} alt="" />
        //             </div>
        //             <div className="dapp-topbar-btns-wrap">
        //                 {!isVerySmallScreen && <AtbashMenu />}
        //                 <ConnectButton />
        //             </div>
        //         </Toolbar>
        //     </AppBar>
        // </div>
    );
}

export default Header;
