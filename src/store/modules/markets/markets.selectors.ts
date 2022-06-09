import Decimal from 'decimal.js';
import { utils } from 'ethers';
import { createSelector } from 'reselect';

import { formatUSDFromDecimal } from 'helpers/price-units';
import { RootState } from 'store/store';

import { selectBASHBalance } from '../account/account.selectors';
import { selectReserve } from '../app/app.selectors';

export const selectFormattedBashBalance = (state: RootState): string | null => {
    const { dai } = state.markets.markets;
    const balance = selectBASHBalance(state);

    if (!dai) return null;

    return formatUSDFromDecimal(balance.mul(dai), 2);
};

export const selectMarketsLoading = (state: RootState): boolean => {
    const { loading } = state.markets;

    return loading;
};

export const selectDaiPrice = (state: RootState): Decimal => {
    return new Decimal(state.markets.markets.dai ?? 0);
};

export const selectMarketPrice = createSelector([selectReserve, selectDaiPrice], (reserve, dai) => reserve.mul(dai));

// converted marketPrice from wei
export const selectComputedMarketPrice = createSelector([selectMarketPrice], marketPrice => marketPrice.div(10 ** 9));
