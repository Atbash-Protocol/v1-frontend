import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export const CritialError = () => {
    const { t } = useTranslation("common");

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h1">{t("errors.critical")}</Typography>
        </Box>
    );
};
