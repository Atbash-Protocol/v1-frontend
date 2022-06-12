import { getBuyLink } from './link';

describe('#getBuyLink', () => {
    it('returns the buy link', () => {
        expect(getBuyLink('USDC', 'DAI')).toEqual('https://app.uniswap.org/#/swap&inputCurrency=USDC&outputCurrency=DAI');
    });
});
