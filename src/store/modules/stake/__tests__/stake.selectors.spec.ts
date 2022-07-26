import { BigNumber } from 'ethers';

import { selectFormattedIndex, selectIndex, selectRawCircSupply, selectStakingBalance, selectStakingReward } from '../stake.selectors';

describe('#selectIndex', () => {
    it('returns the index', () => {
        const state = { main: { staking: { index: null } } };

        expect(selectIndex(state as any)).toEqual(null);
    });
});

describe('#selectFormattedIndex', () => {
    it('returns null if index is null', () => {
        const state = { main: { staking: { index: null } } };

        expect(selectFormattedIndex(state as any)).toEqual(null);
    });

    it('retunrs the formated index', () => {
        const state = {
            main: {
                staking: {
                    index: BigNumber.from(10000000),
                },
            },
        };

        expect(selectFormattedIndex(state as any)).toEqual('0.01 BASH');
    });
});

describe('#selectRawCircSupply', () => {
    it('returns the circ supply', () => {
        const state = { main: { metrics: { rawCircSupply: null } } };

        expect(selectRawCircSupply(state as any)).toEqual(null);
    });
});

describe('#selectStakingReward', () => {
    it('returns the stakingReward', () => {
        const state = { main: { staking: { epoch: { distribute: null } } } };

        expect(selectStakingReward(state as any)).toEqual(null);
    });
});

describe('#selectStakingBalance', () => {
    it('returns the stakingBalance', () => {
        const state = {
            account: { balances: { WSBASH: BigNumber.from(1589255394), SBASH: BigNumber.from(1589553942) } },
            main: {
                staking: {
                    index: BigNumber.from(28945970725),
                    loading: false,
                    epoch: {
                        distribute: BigNumber.from(2207076280),
                        endTime: 1656720899,
                        number: 15,
                    },
                },
                metrics: {
                    rawCircSupply: BigNumber.from(19509034702),
                    totalSupply: 443.622332319,
                    circSupply: 19.5,
                },
            },
            markets: {
                markets: {
                    dai: 1.04,
                },
            },
        };

        expect(selectStakingBalance(state as any)).toEqual({
            effectiveNextRewardValue: '$5,204,312,599.23',
            nextRewardValue: '$0',
            wrappedTokenValue: '$0.00',
        });
    });
});
