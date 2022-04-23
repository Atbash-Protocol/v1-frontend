import React, { useContext, useEffect, useState } from "react";
import "./view-base.scss";
import Header from "components/Header";
import { Box, Hidden, makeStyles, useMediaQuery, Drawer, IconButton, Container, Slide } from "@mui/material";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "constants/styles";

import BackgroundImage from "../../assets/background.png";

import { SideBar } from "components/Sidebar";
import Messages from "components/Messages";
import { NewWeb3ContextProvider, PWeb3Context } from "contexts/web3/web3.context";
import { theme } from "constants/theme";
import { isMobile } from "web3modal";

interface IViewBaseProps {
    children: React.ReactNode;
}

// const useStyles = makeStyles(theme => ({
//     drawer: {
//         [theme.breakpoints.up("md")]: {
//             width: DRAWER_WIDTH,
//             flexShrink: 0,
//         },
//     },
//     content: {
//         padding: theme.spacing(1),
//         transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.sharp,
//             duration: TRANSITION_DURATION,
//         }),
//         height: "100%",
//         overflow: "auto",
//         marginLeft: DRAWER_WIDTH,
//     },
//     contentShift: {
//         transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.easeOut,
//             duration: TRANSITION_DURATION,
//         }),
//         marginLeft: 0,
//     },
// }));

function ViewBase({ children }: IViewBaseProps) {
    const [isSidebarOpen, setisSidebarOpen] = useState(false);

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { state } = useContext(PWeb3Context);

    const handleDrawerToggle = () => {
        setisSidebarOpen(!isSidebarOpen);
    };

    const {
        state: { provider, signer },
    } = useContext(PWeb3Context);

    return (
        <Box
            sx={{
                height: "100vh",
                backgroundImage: `url(${BackgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPositionX: "center",
                backgroundPositionY: "center",
            }}
        >
            <Messages />
            <Header {...{ handleDrawerToggle, isSmallScreen }} />
            <Box>
                <SideBar isSidebarOpen={isSidebarOpen} isSmallScreen handleDrawerToggle={handleDrawerToggle} />
            </Box>
            <Box
                sx={{
                    paddingLeft: {
                        xs: 0,
                        sm: theme.spacing(32), //TODO: Use a dynamic drawer
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default ViewBase;
