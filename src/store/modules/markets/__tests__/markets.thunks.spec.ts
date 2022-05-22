import { Dispatch } from '@reduxjs/toolkit';

import * as CoingeckoModule from 'lib/coingecko/get-prices';

import { getMarketPrices } from '../markets.thunks';

describe('#getMarketPrices', () => {
    it('throws an error if there are no prices', async () => {
        jest.spyOn(CoingeckoModule, 'getTokensPrice').mockResolvedValue({});
        const dispatch: Dispatch = jest.fn();

        const action = await getMarketPrices();
        const { meta, ...rest } = await action(dispatch, () => {}, undefined);

        expect(meta.requestStatus).toEqual('rejected');
        // type RejectedAction
        expect((rest as any).error.message).toBe('Unable to get token prices');
    });

    it('returns the balances and allowances', async () => {
        jest.spyOn(CoingeckoModule, 'getTokensPrice').mockResolvedValue({ dai: 1.01 });
        const dispatch: Dispatch = jest.fn();

        const action = await getMarketPrices();
        const { payload } = await action(dispatch, () => {}, undefined);

        expect(payload).toEqual({ dai: 1.01 });
    });
});
