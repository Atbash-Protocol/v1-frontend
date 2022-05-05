import { utils } from 'ethers';

import { RootState } from 'store/store';

export const selectBASHBalance = (state: RootState): number => {
    const BASHAmount = state.account.balances.BASH; // 9 Decimals

    return BASHAmount.div(10 ** 9).toNumber();
};

export const selectSBASHBalance = (state: RootState): number => {
    const SBASHAmount = state.account.balances.SBASH; // 9 Decimals

    return SBASHAmount.div(10 ** 9).toNumber();
};

export const selectFormattedStakeBalance = (
    state: RootState,
): {
    balances: {
        BASH: string;
        SBASH: string;
        WSBASH: string;
    };
} => {
    const {
        account: { balances },
    } = state;

    return {
        balances: Object.entries(balances).reduce(
            (acc, [key, amount]) => {
                return {
                    ...acc,
                    [key]: [Number(utils.formatUnits(amount, 'gwei')).toFixed(2), key.toLocaleUpperCase()].join(' '),
                };
            },
            {
                BASH: '0.00 BASH',
                SBASH: '0.00 SBASH',
                WSBASH: '0.00 WSBASH',
            },
        ),
    };
};

export const selectFormattedBASHBalance = (state: RootState): string => {
    const BASHAmount = state.account.balances.BASH; // 9 Decimals

    return [Number(utils.formatUnits(BASHAmount, 'gwei')).toFixed(2), 'BASH'].join(' ');
};

export const selectUserStakingAllowance = (state: RootState) => {
    const { BASH, SBASH } = state.account.stakingAllowance;

    return {
        BASHAllowanceNeeded: BASH.gt(0),
        SBASHAllowanceNeeded: SBASH.gt(0),
    };
};
