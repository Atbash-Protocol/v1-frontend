import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { DateTime } from 'luxon';

import {
    selectAppLoading,
    selectBlockchainLoading,
    selectCirculatingSupply,
    selectContractsLoading,
    selectFormattedReservePrice,
    selectMetricsLoading,
    selectReserve,
    selectReserveLoading,
    selectStakingLoading,
    selectUserStakingInfos,
    useBlockchainInfos,
    useContractLoaded,
    useNextRebase,
} from '../app.selectors';

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

describe('#selectReserve', () => {
    it('returns 0 if reserve is undefined', () => {
        const state = { main: { metrics: { reserves: null } } };

        expect(selectReserve(state as any)).toEqual(new Decimal(0));
    });

    it('returns the reservies', () => {
        const state = { main: { metrics: { reserves: BigNumber.from(10) } } };

        expect(selectReserve(state as any)).toEqual(new Decimal(10));
    });
});

describe('#seleectReserveLoading', () => {
    it('returns the reserve loading', () => {
        const state = { main: { metrics: { reserves: null } } };

        expect(selectReserveLoading(state as any)).toEqual(true);
    });
});

describe('#selectBlockchainLoading', () => {
    it('returns the blockchain loading flag', () => {
        const state = { main: { blockchain: { loading: true } } };

        expect(selectBlockchainLoading(state as any)).toEqual(true);
    });
});

describe('#selectMetricsLoading', () => {
    it('returns the metrics loading flag', () => {
        const state = { main: { metrics: { loading: true } } };

        expect(selectMetricsLoading(state as any)).toEqual(true);
    });
});

describe('#selectStakingLoading', () => {
    it('returns the blockchain loading flag', () => {
        const state = { main: { staking: { loading: true } } };

        expect(selectStakingLoading(state as any)).toEqual(true);
    });
});

describe('#selectContractsLoading', () => {
    it('returns the blockchain loading flag', () => {
        const state = { main: { contracts: [{ dai: null }] } };

        expect(selectContractsLoading(state as any)).toEqual(false);
    });
});

describe('#selectAppLoading', () => {
    it('returns the loading app state', () => {
        const state = {
            main: {
                staking: { loading: false },
                metrics: { reserves: BigNumber.from(10), loading: false },
                blockchain: { loading: false },
                contracts: [{ dai: {} }],
            },
        };

        expect(selectAppLoading(state as any)).toBeFalsy();
    });
});

describe('#selectUserStakingInfos', () => {
    it('returns the staking infos', () => {
        const state = {
            main: {
                metrics: {
                    circSupply: 1_0000,
                },
                staking: {
                    epoch: { distribute: BigNumber.from(12 * 10 ** 9) },
                    index: BigNumber.from(100000000000),
                },
            },
            account: {
                balances: {
                    WSBASH: BigNumber.from(150000000000),
                    SBASH: BigNumber.from(500000000000),
                },
            },
        };

        expect(selectUserStakingInfos(state as any)).toEqual({
            effectiveNextRewardValue: '18000000000.6 wsBASH',
            fiveDayRate: '1.8152  %',
            nextRewardValue: '0.60 BASH',
            optionalMetrics: true,
            stakingRebasePercentage: '0.12 %',
            wrappedTokenEquivalent: '15000000000000 sBASH',
        });
    });
});
