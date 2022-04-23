import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid } from "@mui/material";
import { BondMint } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatUSD } from "../../helpers";
// import "./choosebond.scss";
import { IReduxState } from "../../store/slices/state.interface";

import { useTranslation } from "react-i18next";
import { selectAllBonds } from "store/modules/bonds/bonds.selector";
import { selectDAIPrice } from "store/modules/markets/markets.selectors";
import { useEffect } from "react";
import { calcBondDetails, getTreasuryBalance } from "store/modules/bonds/bonds.thunks";
import { useWeb3Context } from "hooks/web3";
import { theme } from "constants/theme";
import { MenuMetric } from "components/Metrics/MenuMetric";
import { BCard } from "components/BCard";

const BondHeader = () => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            sx={{
                [theme.breakpoints.up("xs")]: {
                    display: "none",
                },
                [theme.breakpoints.up("sm")]: {
                    display: "inline-flex",
                },
                color: theme.palette.secondary.main,
            }}
        >
            <Grid item sm={1} />
            <Grid item sm={2}>
                <Typography variant="h6">{t("bond:Mint")}</Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">{t("Price")}</Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">{t("ROI")}</Typography>
            </Grid>
            <Grid item sm={2}>
                <Typography variant="h6">{t("bond:Purchased")}</Typography>
            </Grid>
            <Grid item sm={2} />
        </Grid>
    );
};

function ChooseBond() {
    const { t } = useTranslation();
    const { chainID } = useWeb3Context();
    const dispatch = useDispatch();

    const { activeBonds, inactiveBonds } = useSelector(selectAllBonds);

    const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

    const marketPrice = useSelector<IReduxState, number | null>(selectDAIPrice);

    const treasuryBalance = useSelector<IReduxState, number | null>(state => state.bonds.treasuryBalance);

    const isAppLoading = !marketPrice || !treasuryBalance;

    console.log(marketPrice, isAppLoading, treasuryBalance, activeBonds);

    useEffect(() => {
        if (!isAppLoading) {
            dispatch(calcBondDetails({ bond: activeBonds[0], value: 0 }));
        }
    }, [isAppLoading]);

    return (
        <>
            <BCard title={t("bond:MintTitle")} zoom={true}>
                <Box>
                    <Grid container item xs={12} spacing={2} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <MenuMetric metricKey={t("TreasuryBalance")} value={treasuryBalance ? formatUSD(treasuryBalance) : null} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MenuMetric metricKey={t("BASHPrice")} value={marketPrice ? formatUSD(marketPrice, 2) : null} />
                        </Grid>
                    </Grid>
                    <Grid container item>
                        <BondHeader />

                        {activeBonds.map(bond => (
                            <BondMint key={bond.ID} bondID={bond.ID} />
                        ))}
                    </Grid>
                    )
                </Box>
            </BCard>

            <BCard title={t("bond:MintInactiveTitle")} zoom={true} className="BondList__card">
                <Box>
                    <Grid container item>
                        <BondHeader />
                        {inactiveBonds.map(bond => (
                            <BondMint key={bond.ID} bondID={bond.ID} />
                        ))}
                    </Grid>
                    )
                </Box>
            </BCard>
        </>
    );
}

export default ChooseBond;
