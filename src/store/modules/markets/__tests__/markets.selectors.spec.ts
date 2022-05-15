import Decimal from 'decimal.js';
import { ethers } from 'ethers';

import * as AccountModuleSelectors from 'store/modules/account/account.selectors';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { selectDaiPrice, selectFormattedBashBalance, selectMarketsLoading } from '../markets.selectors';

describe('#selectFormattedBashBalance', () => {
    it('returns the formatted balance', () => {
        jest.spyOn(AccountModuleSelectors, 'selectBASHBalance').mockReturnValue(12);

        const dai = 1.01;
        const state = { markets: { markets: { dai } } };

        expect(selectFormattedBashBalance(state as IReduxState)).toEqual('$12.12');
    });

    it.each([{ dai: null, balance: 0 }])('returns null if dai or balance is null', ({ dai, balance }) => {
        jest.spyOn(AccountModuleSelectors, 'selectBASHBalance').mockReturnValue(balance);
        const state = { markets: { markets: { dai } } };

        expect(selectFormattedBashBalance(state as IReduxState)).toEqual(null);
    });
});

describe('#selectMarketsLoading', () => {
    it.each([true, false])('returns the current loading state', loadingState => {
        const state = { markets: { loading: loadingState } };

        expect(selectMarketsLoading(state as IReduxState)).toEqual(loadingState);
    });
});

describe('#selectDaiPrice', () => {
    it('returns the dai price', () => {
        const state = { markets: { markets: { dai: 1000 } } };

        expect(selectDaiPrice(state as IReduxState)).toEqual(new Decimal(1000));
    });

    it('returns 0 by default', () => {
        const state = { markets: { markets: { dai: null } } };

        expect(selectDaiPrice(state as IReduxState)).toEqual(new Decimal(0));
    });
});
