import Decimal from 'decimal.js';
import { createSelector } from 'reselect';

import { formatUSD } from 'helpers/price-units';
import { RootState } from 'store/store';

import { selectBASHBalance } from '../account/account.selectors';
import { selectReserve } from '../app/app.selectors';

export const selectFormattedBashBalance = (state: RootState): string | null => {
    const { dai } = state.markets.markets;
    const balance = selectBASHBalance(state);

    console.log('here', dai, balance, state);

    if (!dai || balance === null) return null;

    return formatUSD(balance * dai, 2);
};

export const selectMarketsLoading = (state: RootState): boolean => {
    const { loading } = state.markets;

    return loading;
};

export const selectDaiPrice = (state: RootState): Decimal => {
    return new Decimal(state.markets.markets.dai ?? 0);
};

export const selectMarketPrice = createSelector([selectReserve, selectDaiPrice], (reserve, dai) => reserve.mul(dai));
