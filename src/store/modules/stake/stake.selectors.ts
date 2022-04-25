import { ethers } from 'ethers';

import { formatNumber } from 'helpers/price-units';
import { RootState } from 'store/store';

export const selectFormattedIndex = (state: RootState): string | null => {
    const { index } = state.main.staking;

    if (!index) return null;

    const formattedIndex = Number(ethers.utils.formatUnits(index, 'gwei'));

    return `${formatNumber(formattedIndex, 2)} BASH`;
};
