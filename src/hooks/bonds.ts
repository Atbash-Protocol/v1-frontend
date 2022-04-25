import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { BondItem } from 'store/modules/bonds/bonds.types';
import { IReduxState } from 'store/slices/state.interface';

// Slaps together bond data within the account & bonding states
const useBonds = () => {
    const bonds = useSelector<IReduxState, BondItem[]>(state => Object.values(state.bonds.bonds));

    useEffect(() => {
        console.log('userBonds', bonds);
    });
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

export const useLoadedBonds = () => {
    const loadedBonds = useSelector<IReduxState, boolean>(state => Object.values(state.bonds.bonds).length > 0);
};

export const selectBondReady = (bond: BondItem) => {
    return Object.values(bond.metrics).some(metric => metric !== null);
};

export const useBondPurchaseReady = () => {
    const metrics = useSelector<IReduxState, boolean>(state => state.main.metrics.reserves !== null);

    const marketReady = useSelector<IReduxState, boolean>(state => state.markets.markets.dai !== null);

    return metrics && marketReady;
};
