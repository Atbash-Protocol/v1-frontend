import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Paper, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom } from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";

import { useTranslation } from "react-i18next";
import { selectActiveBonds } from "store/modules/bonds/bonds.selector";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { selectDAIPrice } from "store/modules/markets/markets.selectors";
import { useEffect, useState } from "react";
import { calcBondDetails, getTreasuryBalance } from "store/modules/bonds/bonds.thunks";
import bond from "helpers/bond";
import { BondItem, BondSlice } from "store/modules/bonds/bonds.types";
import { useWeb3Context } from "hooks/web3";

function ChooseBond() {
    const { t } = useTranslation();
    const { chainID } = useWeb3Context();
    const dispatch = useDispatch();

    const bonds = useSelector(selectActiveBonds);

    // const { bonds, loading } = useSelector<IReduxState, Pick<BondSlice, "bonds" | "loading">>(state => state.bonds, shallowEqual);

    const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

    const marketPrice = useSelector<IReduxState, number | null>(selectDAIPrice);

    const treasuryBalance = useSelector<IReduxState, number | null>(state => state.bonds.treasuryBalance);

    const isAppLoading = !marketPrice || !treasuryBalance;

    console.log(marketPrice, isAppLoading, treasuryBalance);

    useEffect(() => {
        dispatch(getTreasuryBalance(chainID));
    }, []);

    useEffect(() => {
        if (!isAppLoading) {
            dispatch(calcBondDetails({ bond: bonds[0], value: 0, chainID }));
        }
    }, [isAppLoading]);

    return (
        <div className="choose-bond-view">
            <Zoom in={true}>
                <div className="choose-bond-view-card">
                    <div className="choose-bond-view-card-header">
                        <p className="choose-bond-view-card-title">{t("bond:MintTitle")}</p>
                    </div>

                    <Grid container item xs={12} spacing={2} className="choose-bond-view-card-metrics">
                        <Grid item xs={12} sm={6}>
                            <Box textAlign="center">
                                <p className="choose-bond-view-card-metrics-title">{t("TreasuryBalance")}</p>
                                <p className="choose-bond-view-card-metrics-value">
                                    {isAppLoading ? (
                                        <Skeleton width="180px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(treasuryBalance)
                                    )}
                                </p>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box textAlign="center">
                                <p className="choose-bond-view-card-metrics-title">{t("BASHPrice")}</p>
                                <p className="choose-bond-view-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}</p>
                            </Box>
                        </Grid>
                    </Grid>

                    {!isSmallScreen && (
                        <Grid container item>
                            <TableContainer className="choose-bond-view-card-table">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("bond:Mint")}</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("Price")}</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("ROI")}</p>
                                            </TableCell>
                                            <TableCell align="right">
                                                <p className="choose-bond-view-card-table-title">{t("bond:Purchased")}</p>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bonds
                                            .filter(bond => bond.bondOptions.isActive === true)
                                            .map(bond => (
                                                <BondTableData key={bond.ID} bondID={bond.ID} />
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}
                </div>
            </Zoom>

            {!isSmallScreen && (
                <Zoom in={true}>
                    <div className="choose-bond-view-card inactive-view-card">
                        <div className="choose-bond-view-card-header">
                            <p className="choose-bond-view-card-title">{t("bond:MintInactiveTitle")}</p>
                        </div>
                        <Grid container item>
                            <TableContainer className="choose-bond-view-card-table">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("bond:Mint")}</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("Price")}</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">{t("ROI")}</p>
                                            </TableCell>
                                            <TableCell align="right">
                                                <p className="choose-bond-view-card-table-title">{t("bond:Purchased")}</p>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {/* <TableBody>
                                        {bonds
                                            .filter(bond => !bond.isActive)
                                            .map(bond => (
                                                <BondTableData key={bond.name} bond={bond} />
                                            ))}
                                    </TableBody> */}
                                </Table>
                            </TableContainer>
                        </Grid>
                    </div>
                </Zoom>
            )}
            {isSmallScreen && (
                <>
                    <div className="choose-bond-view-card-container">
                        {/* <Grid container item spacing={2}>
                            {bonds
                                .filter(bond => bond.isActive)
                                .map(bond => (
                                    <Grid item xs={12} key={bond.name}>
                                        <BondDataCard key={bond.name} bond={bond} />
                                    </Grid>
                                ))}
                        </Grid> */}
                    </div>
                    <div className="choose-bond-view-card inactive-view-card">
                        <div className="choose-bond-view-card-header">
                            <p className="choose-bond-view-card-title">{t("bond:MintInactiveTitle")}</p>
                        </div>
                    </div>
                    <div className="choose-bond-view-card-container">
                        {/* <Grid container item spacing={2}>
                            {bonds
                                .filter(bond => !bond.isActive)
                                .map(bond => (
                                    <Grid item xs={12} key={bond.name}>
                                        <BondDataCard key={bond.name} bond={bond} />
                                    </Grid>
                                ))}
                        </Grid> */}
                    </div>
                </>
            )}
        </div>
    );
}

export default ChooseBond;
