import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';

import { ActiveTokensEnum, ACTIVE_TOKENS } from 'config/tokens';
import { getTokensPrice } from 'lib/coingecko/get-prices';

export const getMarketPrices = createAsyncThunk('app/markets', async () => {
    const prices = await getTokensPrice(ACTIVE_TOKENS);

    if (_.isEmpty(prices)) throw new Error('getMarketPrices Error');

    return prices as { [key in ActiveTokensEnum]: number };
});
