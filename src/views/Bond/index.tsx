import BondHeader from "./BondHeader";
import "./bond.scss";
import { IAllBondData } from "../../hooks/bonds";

import { Fade, Grid, Backdrop } from "@mui/material";
import bond from "helpers/bond";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";
import { useEffect, useState } from "react";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { calcBondDetails, getTreasuryBalance } from "store/modules/bonds/bonds.thunks";
import { useWeb3Context } from "hooks/web3";
import { selectActiveBonds } from "store/modules/bonds/bonds.selector";
import { BondDataCard } from "views/ChooseBond/BondRow";

interface IBondProps {
    bond: IAllBondData;
}

function Bond() {
    // const { t } = useTranslation();

    const { chainID } = useWeb3Context();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTreasuryBalance(chainID));
    }, []);

    const bonds = useSelector<IReduxState, LPBond[]>(selectActiveBonds);
    useEffect(() => {
        if (bonds && bonds.length > 0) {
            dispatch(calcBondDetails({ bond: bonds[0], value: 10, chainID }));
        }
    }, [bonds]);

    const [slippage, setSlippage] = useState(0.5);
    const [recipientAddress, setRecipientAddress] = useState("address");

    // const [view, setView] = useState(bond.isActive ? 0 : 1);

    // const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);

    const onRecipientAddressChange = (value: any) => {
        return setRecipientAddress(value);
    };

    const onSlippageChange = (value: any) => {
        return setSlippage(value);
    };

    // useEffect(() => {
    //     if (address) setRecipientAddress(address);
    // }, [provider, address]);

    // const changeView = (newView: number) => () => {
    //     setView(newView);

    // return (
    //     <Fade in={true} mountOnEnter unmountOnExit>
    //         <Grid className="bond-view">
    //             <Backdrop open={true}>
    //                 <Fade in={true}>
    //                     <div className="bond-card">
    //                         <BondHeader
    //                             bond={bond}
    //                             slippage={slippage}
    //                             recipientAddress={recipientAddress}
    //                             onSlippageChange={onSlippageChange}
    //                             onRecipientAddressChange={onRecipientAddressChange}
    //                         />
    //                         {/* @ts-ignore */}
    //                         <Box direction="row" className="bond-price-data-row">
    //                             <div className="bond-price-data">
    //                                 <p className="bond-price-data-title">{t("bond:MintPrice")}</p>
    //                                 <p className="bond-price-data-value">
    //                                     {isBondLoading ? <Skeleton /> : bond.isLP || bond.name === "wavax" ? `$${trim(bond.bondPrice, 2)}` : `${trim(bond.bondPrice, 2)} MIM`}
    //                                 </p>
    //                             </div>
    //                             <div className="bond-price-data">
    //                                 <p className="bond-price-data-title">{t("BASHPrice")}</p>
    //                                 <p className="bond-price-data-value">{isBondLoading ? <Skeleton /> : `$${trim(bond.marketPrice, 2)}`}</p>
    //                             </div>
    //                         </Box>

    //                         {bond.isActive && (
    //                             <div className="bond-one-table">
    //                                 <div className={classnames("bond-one-table-btn", { active: !view })} onClick={changeView(0)}>
    //                                     <p>{t("bond:Mint")}</p>
    //                                 </div>
    //                                 <div className={classnames("bond-one-table-btn", { active: view })} onClick={changeView(1)}>
    //                                     <p>{t("bond:Redeem")}</p>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {bond.isActive && (
    //                             <TabPanel value={view} index={0}>
    //                                 <BondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress} />
    //                             </TabPanel>
    //                         )}

    //                         <TabPanel value={view} index={1}>
    //                             <BondRedeem bond={bond} />
    //                         </TabPanel>
    //                     </div>
    //                 </Fade>
    //             </Backdrop>
    //         </Grid>
    //     </Fade>
    // );

    // return (
    //     <Fade in={true} mountOnEnter unmountOnExit>
    //         <Grid className="bond-view">
    //             <Backdrop open={true}>
    //                 <Fade in={true}>
    //                     <div className="bond-card">
    //                         <BondHeader
    //                             bond={bond[0]}
    //                             slippage={slippage}
    //                             recipientAddress={recipientAddress}
    //                             onSlippageChange={onSlippageChange}
    //                             onRecipientAddressChange={onRecipientAddressChange}
    //                         />
    //                     </div>
    //                 </Fade>
    //             </Backdrop>
    //         </Grid>
    //     </Fade>
    // );

    return (
        <Grid container item spacing={2}>
            {bonds.map(bond => (
                <Grid item xs={12} key={bond.ID}>
                    <BondDataCard bondID={bond.ID} />
                </Grid>
            ))}
        </Grid>
    );
}

export default Bond;
