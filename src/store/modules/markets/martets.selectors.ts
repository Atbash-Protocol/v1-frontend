import { formatUSD } from "helpers/price-units";
import { RootState } from "store/store";

export const selectBashPrice = (state: RootState): string | null => {
    const { dai } = state.markets.markets;

    if (!dai) return null;

    const BASHAmount = state.accountNew.balances.BASH;

    return formatUSD(BASHAmount.toNumber() * dai, 2);
};

export const selectSBASHValue = (state: RootState): string | null => {
    const { dai } = state.markets.markets;

    if (!dai) return null;

    const SBASH = state.accountNew.balances.SBASH;

    return formatUSD(SBASH.toNumber() * dai, 2);
};
