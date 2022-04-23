import { Box, Grid, Typography } from "@mui/material";
import MemoInlineMetric from "components/Metrics/InlineMetric";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BondItem } from "store/modules/bonds/bonds.types";
import { IReduxState } from "store/slices/state.interface";

const BondMetrics = ({ bond }: any) => {
    const { t } = useTranslation();

    console.log("bond meetrics", bond);

    if (!bond) {
        return <> </>;
    }

    const { maxBondPrice, bondDiscount, vestingTerm } = bond;

    const metrics2 = [
        { value: (maxBondPrice ?? "").toString(), metricKey: t("bond:MaxYouCanBuy") },
        {
            metricKey: t("bond:ROI"),
            value: bondDiscount,
        },
        { metricKey: t("bond:MinimumPurchase"), value: vestingTerm },
    ].map(({ value, metricKey }, index) => <MemoInlineMetric {...{ value, metricKey }} key={index} />);

    return (
        <Grid xs={12} container>
            {metrics2}
        </Grid>
    );
};

export default BondMetrics;
