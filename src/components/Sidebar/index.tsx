import { Drawer } from "@mui/material";
import { theme } from "constants/theme";
import { useAppReady } from "hooks/useAppReady";
import Content from "./Content";

interface INavDrawer {
    isSidebarOpen: boolean;
    isSmallScreen: boolean;
    handleDrawerToggle: () => void;
}

const SideBar = ({ isSidebarOpen, isSmallScreen, handleDrawerToggle }: INavDrawer) => {
    const isAppReady = useAppReady();

    const drawerOptions = {
        variant: isSidebarOpen ? "temporary" : "permanent",
        anchor: "left",
        open: isSidebarOpen,
        onClose: isSmallScreen ? handleDrawerToggle : {},
        onClick: isSmallScreen ? handleDrawerToggle : {},
    };

    return (
        <Drawer
            variant={isSidebarOpen ? "temporary" : "permanent"}
            anchor={"left"}
            open={false}
            onClose={isSmallScreen ? handleDrawerToggle : () => {}}
            onClick={isSmallScreen ? handleDrawerToggle : () => {}}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                transition: theme.transitions.create(["background-color", "transform"]),
            }}
        >
            {isAppReady && <Content />}
        </Drawer>
    );
};
export { SideBar };
