import { ethers } from "ethers";
import { RootState } from "store/store";

export const selectBASHBalance = (state: RootState): number | null => {
    const BASHAmount = state.accountNew.balances.BASH; // 9 Decimals

    if (!BASHAmount) return null;

    return Number(ethers.utils.formatUnits(BASHAmount, "gwei"));
};

export const selectSBASHBalance = (state: RootState): number | null => {
    const SBASHAmount = state.accountNew.balances.BASH; // 9 Decimals

    if (!SBASHAmount) return null;

    return Number(ethers.utils.formatUnits(SBASHAmount, "gwei"));
};
