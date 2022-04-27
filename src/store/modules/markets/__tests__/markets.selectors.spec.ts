import { ethers } from 'ethers';

import * as AccountModuleSelectors from 'store/modules/account/account.selectors';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { selectFormattedBashBalance, selectMarketsLoading } from '../markets.selectors';

describe('#selectFormattedBashBalance', () => {
    it.each([
        { balance: null, dai: 1 },
        { balance: 2, dai: null },
        { balance: null, dai: null },
    ])('returns null when balance is $balance and DAI price is $dai', ({ balance, dai }) => {
        jest.spyOn(AccountModuleSelectors, 'selectBASHBalance').mockReturnValue(balance);

        const state = { markets: { markets: { dai } } };

        expect(selectFormattedBashBalance(state as IReduxState)).toBeNull();
    });

    it('returns the formatted balance', () => {
        jest.spyOn(AccountModuleSelectors, 'selectBASHBalance').mockReturnValue(12);

        const dai = 1.01;
        const state = { markets: { markets: { dai } } };

        expect(selectFormattedBashBalance(state as IReduxState)).toEqual('$12.12');
    });
});

describe('#selectMarketsLoading', () => {
    it.each([true, false])('returns the current loading state', loadingState => {
        const state = { markets: { loading: loadingState } };

        expect(selectMarketsLoading(state as IReduxState)).toEqual(loadingState);
    });
});
