import { formatUSD, trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectBondInfos, selectBondMintingMetrics } from "store/modules/bonds/bonds.selector";
import { IReduxState } from "store/slices/state.interface";
import { BondItem } from "store/modules/bonds/bonds.types";

interface IBondProps {
    bondID: string;
}

export function BondDataCard({ bondID }: IBondProps) {
    const { t } = useTranslation();

    const bond = useSelector<IReduxState, BondItem | null>(state => selectBondInfos(state.bonds.bonds, bondID)) as BondItem | null;

    if (!bond) return <>"Loading";</>;

    const isBondLoading = bond;

    return (
        <Slide direction="up" in={true}>
            <Paper className="bond-data-card">
                <div className="bond-pair">
                    <BondLogo bondLogoPath="path" isLP={false} />
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
                    {/* <p className="bond-price bond-name-title">
                        <>
                            {priceUnits(bond)} {isBondLoading ? <Skeleton width="50px" /> : trim(bond.bondPrice, 2)}
                        </>
                    </p> */}
                </div>

                <div className="data-row">
                    <p className="bond-name-title">{t("ROI")}</p>
                    <p className="bond-name-title">{!bond.metrics.bondDiscount ? <Skeleton width="50px" /> : trim(bond.metrics.bondDiscount * 100, 2)}%</p>
                    {/* <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.metrics. * 100, 2)}%`}</p> */}
                </div>

                <div className="data-row">
                    <p className="bond-name-title">{t("bond:Purchased")}</p>
                    <p className="bond-name-title">{!bond.metrics.bondPrice ? <Skeleton /> : formatUSD(bond.metrics.bondPrice.toNumber(), 2)}</p>
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
