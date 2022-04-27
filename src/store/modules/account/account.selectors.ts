import { ethers } from 'ethers';

import { RootState } from 'store/store';

export const selectBASHBalance = (state: RootState): number | null => {
    const BASHAmount = state.accountNew.balances.BASH; // 9 Decimals

    return Number(ethers.utils.formatUnits(BASHAmount, 'gwei'));
};

export const selectSBASHBalance = (state: RootState): number | null => {
    const SBASHAmount = state.accountNew.balances.SBASH; // 9 Decimals

    return Number(ethers.utils.formatUnits(SBASHAmount, 'gwei'));
};

export const selectFormattedStakeBalance = (
    state: RootState,
): {
    balances: {
        BASH: number;
        SBASH: number;
        WSBASH: number;
    };
} => {
    const {
        accountNew: { balances },
    } = state;

    return {
        balances: Object.entries(balances).reduce(
            (acc, [key, amount]) => {
                return { ...acc, [key]: Number(ethers.utils.formatUnits(amount, 'gwei')) };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
            {
                BASH: 0,
                SBASH: 0,
                WSBASH: 0,
            },
        ),
    };
};
