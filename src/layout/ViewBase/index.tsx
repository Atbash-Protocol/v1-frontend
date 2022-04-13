import React, { useEffect, useState } from "react";
import "./view-base.scss";
import Header from "components/Header";
import { Box, Hidden, makeStyles, useMediaQuery, Drawer, IconButton } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "constants/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { Sidebar, SidebarMobile } from "components/Sidebar";
import Messages from "components/Messages";
import { useWeb3Context } from "hooks/web3";

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    content: {
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        height: "100%",
        overflow: "auto",
        marginLeft: DRAWER_WIDTH,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();

    const isSmallerScreen = useMediaQuery("(max-width: 960px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (hasCachedProvider()) {
            connect().then(() => {
                console.info("connected");
            });
        }
    }, []);

    return (
        <div className="view-base-root">
            <Messages />
            <Header drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
            <div className={classes.drawer}>
                <Hidden mdUp>
                    <SidebarMobile mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                </Hidden>
                <Hidden smDown>
                    <Sidebar />
                </Hidden>
            </div>
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>{children}</div>
        </div>
    );
}

export default ViewBase;
