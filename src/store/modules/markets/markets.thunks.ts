import { createAsyncThunk } from '@reduxjs/toolkit';

import { ActiveTokensEnum, ACTIVE_TOKENS } from 'config/tokens';
import { getTokensPrice } from 'lib/coingecko/get-prices';

type MarketPrices<T> = {
    [key in ActiveTokensEnum]: T;
};

export const getMarketPrices = createAsyncThunk('app/markets', async () => {
    const prices = await getTokensPrice(ACTIVE_TOKENS);

    return prices as MarketPrices<number>;
});
