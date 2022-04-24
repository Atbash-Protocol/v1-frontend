import { Typography } from "@mui/material";
import { BCard } from "components/BCard";
import { useTranslation } from "react-i18next";

function Forecast() {
    const { t } = useTranslation();

    return (
        <BCard title={t("bond:Forecast")} zoom={true}>
            <Typography> {t("ComingSoon")} </Typography>
        </BCard>
    );
}

export default Forecast;
