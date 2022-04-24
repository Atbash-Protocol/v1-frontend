import { Typography } from "@mui/material";
import { BCard } from "components/BCard";
import { useTranslation } from "react-i18next";

function Redeem() {
    const { t } = useTranslation();

    return (
        <BCard title={t("bond:Redeem")} zoom={true}>
            <Typography> {t("ComingSoon")} </Typography>
        </BCard>
    );
}

export default Redeem;
