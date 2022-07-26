import { ActiveTokensEnum } from 'config/tokens';

import { getMarketPrices } from '../markets.thunks';
import MarketReducer from './../markets.slice';

describe('#MarketReducer', () => {
    describe('#getMarketPrices', () => {
        const initialState = {
            markets: {
                [ActiveTokensEnum.DAI]: null,
            },
            loading: true,
        };

        it('reduces fulfilled', () => {
            const payload = { bash: 1000 };
            const action = { type: getMarketPrices.fulfilled, payload };
            const state = MarketReducer(initialState, action);

            expect(state).toEqual({
                ...initialState,
                markets: {
                    bash: 1000,
                },
                loading: false,
            });
        });
    });
});
