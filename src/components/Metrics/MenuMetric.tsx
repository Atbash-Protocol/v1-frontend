import { Box, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { useMemo } from "react";

export const MenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                {metricKey}
            </Typography>
            <Typography variant="body1" sx={{ overflow: "hidden", wordBreak: "break-all", overflowX: "hidden", color: theme.palette.secondary.main }}>
                {value === undefined ? <Skeleton /> : <>{value}</>}
            </Typography>
        </Box>
    );
};

const MemoMenuMetric = ({ metricKey, value }: { metricKey: string; value: unknown | null }) => {
    return useMemo(() => {
        return <MenuMetric {...{ metricKey, value }} />;
    }, [metricKey, value]);
};

export default MemoMenuMetric;
