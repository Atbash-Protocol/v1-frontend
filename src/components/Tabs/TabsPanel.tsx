import { Box } from "@mui/material";
import { theme } from "constants/theme";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            sx={{ color: theme.palette.secondary.main }}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3, display: "inline-flex", alignItems: "center", width: "100%" }}>{children}</Box>}
        </Box>
    );
};

export default TabPanel;
