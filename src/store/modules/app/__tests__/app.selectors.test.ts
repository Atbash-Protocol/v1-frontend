import { BigNumber } from 'ethers';
import { DateTime } from 'luxon';

import { selectCirculatingSupply, selectFormattedReservePrice, useBlockchainInfos, useContractLoaded, useNextRebase } from '../app.selectors';

describe('#selectFormattedReservePrice', () => {
    it.each([
        { reserves: null, dai: null },
        { reserves: 1, dai: null },
        { reserves: null, dai: 1 },
    ])('returns null if reserve is $reserve and dai is $dai', ({ reserves, dai }) => {
        const state = { main: { metrics: { reserves } }, markets: { markets: { dai } } };

        expect(selectFormattedReservePrice(state as any)).toEqual(null);
    });

    it('returns the formatted reserve price', () => {
        const state = { main: { metrics: { reserves: BigNumber.from(120 * 10 ** 9) } }, markets: { markets: { dai: 1.1 } } };

        expect(selectFormattedReservePrice(state as any)).toEqual('$132.00');
    });
});

describe('#useContractLoaded', () => {
    // contracts should be instance of ethers.Contract but here we only need to check null assertions
    it.each([
        { BASH: null, SBASH: null },
        { BASH: null, SBASH: 'definedContract' },
        { BASH: 'definedContract', SBASH: null },
    ])('returns false if not all contracts are loaded', ({ BASH, SBASH }) => {
        const state = { main: { contracts: { BASH, SBASH } } };

        expect(useContractLoaded(state as any)).toEqual(false);
    });

    it('returns false if contracts are not loaded', () => {
        const state = { main: { contracts: { BASH: 'DEFINED', SBASH: 'DEFINED' } } };

        expect(useContractLoaded(state as any)).toEqual(true);
    });
});

describe('#useNextRebase', () => {
    it('returns the next rebase', () => {
        const endTime = DateTime.utc().toMillis();
        const state = { main: { staking: { epoch: { endTime } } } };

        expect(useNextRebase(state as any)).toEqual(endTime);
    });
});

describe('#useBlockchainInfos', () => {
    it('returns the blockchain state', () => {
        const blockchainInfos = { currentBlock: 1, timestamp: DateTime.utc().toMillis() };
        const state = { main: { blockchain: blockchainInfos } };

        expect(useBlockchainInfos(state as any)).toEqual(blockchainInfos);
    });
});

describe('#selectCirculatingSupply', () => {
    it('returns the circulating supply', () => {
        const circSupply = 100000;
        const state = { main: { metrics: { circSupply } } };

        expect(selectCirculatingSupply(state as any)).toEqual(circSupply);
    });
});

// describe('#selectUserStakingInfos', () => {});
