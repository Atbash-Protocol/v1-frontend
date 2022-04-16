import { formatUSD, priceUnits, trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
// import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectBondInfos, selectBondMintingMetrics } from "store/modules/bonds/bonds.selector";
import { IReduxState } from "store/slices/state.interface";
import { BondItem } from "store/modules/bonds/bonds.types";
import { Grid, Typography, Divider, Button } from "@mui/material";
import { theme } from "constants/theme";
import { useWeb3Context } from "hooks/web3";
import { Box } from "@mui/material";

interface IBondProps {
    bondID: string;
}

export function BondDataCard({ bondID }: IBondProps) {
    const { t } = useTranslation();

    const bond = useSelector<IReduxState, BondItem | null>(state => selectBondInfos(state.bonds.bonds, bondID)) as BondItem | null;

    if (!bond) return <>"Loading";</>;

    const { bondPrice, bondDiscount, purchased } = selectBondMintingMetrics(bond.metrics);

    const isBondLoading = bond;

    return (
        <Slide direction="up" in={true}>
            <Paper className="bond-data-card">
                <div className="bond-pair">
                    <BondLogo bondLogoPath={bond.bondInstance.bondOptions.iconPath} isLP={false} />
                    <div className="bond-name">
                        <p className="bond-name-title">{bond.bondInstance.bondOptions.displayName}</p>
                        {bond.bondInstance.isLP() && (
                            <Link href={bond.bondInstance.getLPProvider()} target="_blank">
                                <p className="bond-name-title">{t("bond:ViewContract")}</p>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="data-row">
                    <p className="bond-name-title">{t("Price")}</p>
                    <p className="bond-price bond-name-title">
                        <>
                            {priceUnits(bond as any)} {isBondLoading ? <Skeleton width="50px" /> : bondPrice}
                        </>
                    </p>
                </div>

                <div className="data-row">
                    <p className="bond-name-title">{t("ROI")}</p>
                    <p className="bond-name-title">{!bond.metrics.bondDiscount ? <Skeleton width="50px" /> : bondDiscount}</p>
                    {/* <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.metrics. * 100, 2)}%`}</p> */}
                </div>

                <div className="data-row">
                    <p className="bond-name-title">{t("bond:Purchased")}</p>
                    <p className="bond-name-title">{!bond.metrics.bondPrice ? <Skeleton /> : bondPrice}</p>
                </div>
                <Link component={NavLink} to={`/mints/${bond.bondInstance.ID}`}>
                    <div className="bond-table-btn">
                        {bond.bondInstance.bondOptions.isActive ? (
                            <p>{t("bond:MintBond", { bond: bond.bondInstance.bondOptions.isActive })}</p>
                        ) : (
                            <p>{t("bond:RedeemBond", { bond: bond.bondInstance.bondOptions.displayName })}</p>
                        )}
                    </div>
                </Link>
            </Paper>
        </Slide>
    );
}

export function BondTableData({ bondID }: IBondProps) {
    const { t } = useTranslation();

    const bond = useSelector<IReduxState, BondItem | null>(state => selectBondInfos(state.bonds.bonds, bondID)) as BondItem | null;

    if (!bond) return <>"Loading";</>;

    const state = useSelector(state => (state as any).bonds);

    const { bondPrice, bondDiscount, purchased } = selectBondMintingMetrics(bond.metrics);

    const bondSoldOut = (bond.metrics.bondDiscount ?? 0) * 100 < -30;
    return (
        <TableRow className={bondSoldOut ? "bond-soldout" : ""}>
            <TableCell align="left">
                <BondLogo bondLogoPath={bond.bondInstance.bondOptions.iconPath} isLP={false} />
                <div className="bond-name">
                    <p className="bond-name-title">{bond.bondInstance.bondOptions.displayName}</p>
                    {bond.bondInstance.isLP() && (
                        <Link color="primary" href={bond.bondInstance.getLPProvider()} target="_blank">
                            <p className="bond-name-title">{t("bond:ViewContract")}</p>
                        </Link>
                    )}
                </div>
            </TableCell>
            <TableCell align="center">
                <p className="bond-name-title">
                    <>
                        {/* <span className="currency-icon">{priceUnits(bond)}</span> {isBondLoading ? <Skeleton width="50px" /> : trim(bond.bondPrice, 2)} */}
                        <span className="currency-icon"></span> {!bond.metrics.bondPrice ? <Skeleton width="50px" /> : bondPrice}
                    </>
                </p>
            </TableCell>
            <TableCell align="right">
                <p className="bond-name-title">{!bond.metrics.bondDiscount ? <Skeleton width="50px" /> : bondDiscount}</p>
            </TableCell>
            <TableCell align="right">
                <p className="bond-name-title">{bond.metrics.purchased === null ? <Skeleton /> : purchased}</p>
            </TableCell>
            <TableCell>
                <Link component={NavLink} to={`/mints/${bond.bondInstance.ID}`}>
                    <div className="bond-table-btn">
                        <p>{bond.bondInstance.bondOptions.isActive ? t("bond:Mint") : t("bond:Redeem")}</p>
                    </div>
                </Link>
            </TableCell>
        </TableRow>
    );
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

export const BondMint = ({ bondID }: IBondProps) => {
    const { t } = useTranslation();

    const { connected } = useWeb3Context();

    const bond = useSelector<IReduxState, BondItem | null>(state => selectBondInfos(state.bonds.bonds, bondID)) as BondItem | null;

    if (!bond) return <>"Loading";</>;

    const { bondPrice, bondDiscount, purchased } = selectBondMintingMetrics(bond.metrics);

    const bondSoldOut = (bond.metrics.bondDiscount ?? 0) * 100 < -30;

    const metrics = [
        { metric: t("bond:Mint"), value: bondPrice },
        {
            metric: t("Price"),
            value: bondDiscount,
        },
        { metric: t("ROI"), value: purchased },
    ].map(metric => <BondMintMetric {...metric} />);

    return (
        <Grid
            container
            sx={{
                color: bondSoldOut ? theme.palette.primary.main : theme.palette.secondary.main,
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
                xs={12}
                sx={{
                    [theme.breakpoints.up("xs")]: {
                        marginTop: theme.spacing(1),
                    },
                }}
            >
                {connected && (
                    <Link component={NavLink} to={`/mints/${bond.bondInstance.ID}`}>
                        <Button sx={{ background: theme.palette.background.default, padding: `${theme.spacing(1)} ${theme.spacing(8)}` }}>
                            <p>{bond.bondInstance.bondOptions.isActive ? t("bond:Mint") : t("bond:Redeem")}</p>
                        </Button>
                    </Link>
                )}
            </Grid>
        </Grid>
    );
};
