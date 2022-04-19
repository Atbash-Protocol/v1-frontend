import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";

const BondMetrics = () => {
    const { t } = useTranslation();
    const metrics = useSelector((state: IReduxState) => state.bonds.bonds[0].metrics);

    return (
        <Grid xs={12} container>
            <Grid xs={12}>
                <Typography variant="body1">{t("bond:MaxYouCanBuy")}</Typography>
                {metrics.maxBondPrice}
            </Grid>
            <Grid xs={12}>
                <Typography variant="body1">{t("bond:ROI")}</Typography>
                {metrics.bondDiscount}
            </Grid>
            <Grid xs={12}>
                <Typography variant="body1">{t("bond:VestingTerm")}</Typography>
                {metrics.vestingTerm}
            </Grid>
            <Grid xs={12}>
                <Typography variant="body1">{t("bond:MinimumPurchase")}</Typography>
                0.01 SB
            </Grid>
        </Grid>
    );
};

export default BondMetrics;
