import { createAsyncThunk } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';

import { ActiveTokensEnum, ACTIVE_TOKENS } from 'config/tokens';
import { getTokensPrice } from 'lib/coingecko/get-prices';

export const getMarketPrices = createAsyncThunk('app/markets', async () => {
    const prices = await getTokensPrice(ACTIVE_TOKENS);

    if (isEmpty(prices)) throw new Error('Unable to get token prices');

    return prices as { [key in ActiveTokensEnum]: number };
});
