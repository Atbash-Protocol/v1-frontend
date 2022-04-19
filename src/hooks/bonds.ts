import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "../helpers/bond";
import { Bond } from "../helpers/bond/bond";
import { IBondDetails, IBondSlice } from "../store/slices/bond-slice";
import { IReduxState } from "store/slices/state.interface";
import { IUserBondDetails } from "store/account/account.types";
import { selectAllBonds } from "store/modules/bonds/bonds.selector";
import { BondItem } from "store/modules/bonds/bonds.types";

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

// Slaps together bond data within the account & bonding states
const useBonds = () => {
    const bonds = useSelector<IReduxState, BondItem[]>(state => Object.values(state.bonds.bonds));

    const mostProfitableBonds = bonds.sort((bond1, bond2): any => {
        if (bond1.metrics.bondDiscount === null || bond2.metrics.bondDiscount === null) return 0;

        return bond1.metrics.bondDiscount > bond2.metrics.bondDiscount;
    });

    return {
        bonds,
        mostProfitableBonds,
    };
};

export default useBonds;
