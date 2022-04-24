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

    console.log("isSmallScreen", isAppReady, isSmallScreen);

    return (
        <Drawer
            variant={isSidebarOpen ? "temporary" : "permanent"}
            anchor={"left"}
            open={isSidebarOpen}
            onClick={isSmallScreen ? handleDrawerToggle : undefined}
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
