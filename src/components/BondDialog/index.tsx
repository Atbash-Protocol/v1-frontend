import { DialogContent } from "@material-ui/core";
import { Box, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import BondLogo from "components/BondLogo";
import { MenuMetric } from "components/Metrics/MenuMetric";
import { theme } from "constants/theme";
import { t } from "i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectFormattedReservePrice } from "store/modules/app/app.selectors";
import { selectBondMintingMetrics } from "store/modules/bonds/bonds.selector";
import { getBondTerms } from "store/modules/bonds/bonds.thunks";
import { BondItem } from "store/modules/bonds/bonds.types";
import BondPurchase from "views/Bond/actions/BondPurchase";
import BondMetrics from "views/Bond/BondMetrics";

export const BondDialog = ({ open, bond }: { open: boolean; bond: BondItem }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onBackdropClick = () => history.goBack();

    const metrics = selectBondMintingMetrics(bond.metrics);
    const bashPrice = useSelector(selectFormattedReservePrice);

    useEffect(() => {
        if (!bond.terms) {
            dispatch(getBondTerms(bond));
        }
    }, [bond.terms]);

    return (
        <Dialog
            {...{
                onBackdropClick,
                open,
                maxWidth: "sm",
                fullWidth: true,
                PaperProps: { sx: { background: theme.palette.cardBackground.light, color: theme.palette.primary.dark } },
            }}
            sx={{ p: 2, backdropFilter: "blur(10px)" }}
        >
            <DialogTitle sx={{ display: "inline-flex", alignItems: "center", justifyContent: "space-evenly", gap: theme.spacing(2) }}>
                <BondLogo bondLogoPath={bond.bondInstance.bondOptions.iconPath} isLP={bond.bondInstance.isLP()} />

                <Typography variant="body1">{bond.bondInstance.bondOptions.displayName}</Typography>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Grid container item xs={12} spacing={2} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={"treasuryBalance"} metricKey={t("TreasuryBalance")} value={metrics.bondPrice} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric key={"BashPrice"} metricKey={t("BASHPrice")} value={bashPrice} />
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <BondPurchase bond={bond} />
                    <BondMetrics />
                </Box>
            </DialogContent>
        </Dialog>
    );
};
