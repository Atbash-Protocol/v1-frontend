import { Box, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { useTranslation } from "react-i18next";

export const MenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    console.log("metric", metricKey, value);
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                {metricKey}
            </Typography>
            <Typography variant="body1" sx={{ overflow: "hidden", wordBreak: "break-all", overflowX: "hidden", color: theme.palette.secondary.main }}>
                {!value ? <Skeleton /> : <>{value}</>}
            </Typography>
        </Box>
    );
};
