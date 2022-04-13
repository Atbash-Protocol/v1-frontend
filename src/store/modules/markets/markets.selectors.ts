import { formatUSD } from "helpers/price-units";
import { RootState } from "store/store";
import { selectBASHBalance } from "../account/account.selectors";

export const selectFormattedBashBalance = (state: RootState): string | null => {
    const { dai } = state.markets.markets;
    const balance = selectBASHBalance(state);

    if (!dai || !balance) return null;

    return formatUSD(balance * dai, 2);
};
