import axios from 'axios';

import { getTokensPrice } from '../get-prices';

describe('#getTokenPrice', () => {
    it('returns the token prices from coingecko', async () => {
        const spy = jest.spyOn(axios, 'get').mockResolvedValue({ data: { dai: { usd: 1.1 }, usdc: { usd: 1.01 } } });

        await expect(getTokensPrice(['dai', 'usdc'])).resolves.toEqual({ dai: 1.1, usdc: 1.01 });
        expect(spy).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=dai,usdc');
    });
});
