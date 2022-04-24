import { Box, Button, Grid, Link, Skeleton, Typography } from "@mui/material";
import BondLogo from "components/BondLogo";
import { theme } from "constants/theme";
import { useWeb3Context } from "hooks/web3";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectBondInfos, selectBondMintingMetrics } from "store/modules/bonds/bonds.selector";
import { BondItem } from "store/modules/bonds/bonds.types";
import { IReduxState } from "store/slices/state.interface";

interface IBondProps {
    bondID: string;
}

const BondMintMetric = ({ metric, value }: { metric: string; value: string | null }) => {
    return (
        <Grid
            item
            sm={2}
            xs={12}
            sx={{
                [theme.breakpoints.up("xs")]: {
                    display: "inline-flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                },
            }}
        >
            <Box
                sx={{
                    [theme.breakpoints.up("xs")]: {
                        display: "flex",
                    },
                    [theme.breakpoints.up("sm")]: {
                        display: "none",
                    },
                }}
            >
                <Typography variant="body1">{metric}</Typography>
            </Box>
            <Box>
                {!value && <Skeleton />}
                {value && <Typography variant="h6">{value}</Typography>}
            </Box>
        </Grid>
    );
};

export const BondtListItem = ({ bondID }: IBondProps) => {
    const { t } = useTranslation();

    const { signer } = useSafeSigner();

    const bond = useSelector<IReduxState, BondItem | null>(state => selectBondInfos(state.bonds.bonds, bondID)) as BondItem | null;

    if (!bond) return <>"Loading";</>;

    const { bondPrice, bondDiscount, purchased } = selectBondMintingMetrics(bond.metrics);
    const bondSoldOut = (bond.metrics.bondDiscount ?? 0) * 100 < -30;

    console.log(bond, bondPrice, bondDiscount, purchased);

    const metrics = [
        { metric: t("bond:Mint"), value: bondPrice },
        {
            metric: t("Price"),
            value: bondDiscount,
        },
        { metric: t("ROI"), value: purchased },
    ].map((metric, i) => <BondMintMetric key={`bondMetric-${i}`} {...metric} />);

    return (
        <Grid
            container
            sx={{
                color: bondSoldOut ? theme.palette.primary.main : theme.palette.primary.main,
                [theme.breakpoints.up("xs")]: {
                    marginBottom: theme.spacing(2),
                    paddingBottom: theme.spacing(4),
                },
                [theme.breakpoints.up("sm")]: {
                    marginBottom: theme.spacing(0),
                    paddingBottom: theme.spacing(2),
                },
                alignItems: "center",
            }}
        >
            <Grid item sm={1} xs={4}>
                <BondLogo bondLogoPath={bond.bondInstance.bondOptions.iconPath} isLP={bond.bondInstance.isLP()} />
            </Grid>
            <Grid item sm={2} xs={8}>
                <Typography variant="body1">{bond.bondInstance.bondOptions.displayName}</Typography>
            </Grid>
            {metrics}

            <Grid
                item
                sm={3}
                sx={{
                    border: "1px solid",
                    [theme.breakpoints.down("xs")]: {
                        display: "none",
                    },
                }}
            >
                {signer && (
                    <Button disabled={!bond.bondInstance.bondOptions.isActive} sx={{ padding: `${theme.spacing(1)} ${theme.spacing(3)}` }}>
                        <Link component={NavLink} to={`/mints/${bond.bondInstance.ID}`}>
                            <p>{bond.bondInstance.bondOptions.isActive ? t("bond:Mint") : t("bond:Redeem")}</p>
                        </Link>
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};
