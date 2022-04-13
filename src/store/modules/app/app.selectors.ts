import { ethers } from "ethers";
import { formatUSD } from "helpers/price-units";
import { RootState } from "store/store";

export const selectFormattedReservePrice = (state: RootState): string | null => {
    const { reserves } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!reserves || !dai) return null;

    const reservePrice = Number(ethers.utils.formatUnits(reserves, "gwei")) * dai;

    return formatUSD(reservePrice, 2);
};
