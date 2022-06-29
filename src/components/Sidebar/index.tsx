import { Drawer, makeStyles } from "@material-ui/core";
import { DRAWER_WIDTH } from "constants/styles";
import Content from "./Content";

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
        borderRight: 0,
    },
}));

interface INavDrawer {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

function Sidebar() {
    return (
        <Drawer variant="permanent" anchor="left">
            <Content />
        </Drawer>
    );
}

function SidebarMobile({ mobileOpen, handleDrawerToggle }: INavDrawer) {
    const classes = useStyles();

    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onClick={handleDrawerToggle}
            classes={{
                paper: classes.drawerPaper,
            }}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Content />
        </Drawer>
    );
}

export { Sidebar, SidebarMobile };
