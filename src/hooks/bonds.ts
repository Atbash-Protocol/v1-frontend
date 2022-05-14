import { useSelector } from 'react-redux';

import { BondItem } from 'store/modules/bonds/bonds.types';
import { IReduxState } from 'store/slices/state.interface';

//TODO: Refactor and move to bonds.selector
export const selectBondReady = (bond: BondItem) => {
    return Object.values(bond.metrics).some(metric => metric !== null);
};

export const useBondPurchaseReady = () => {
    const metrics = useSelector<IReduxState, boolean>(state => state.main.metrics.reserves !== null);

    const marketReady = useSelector<IReduxState, boolean>(state => state.markets.markets.dai !== null);

    return metrics && marketReady;
};
