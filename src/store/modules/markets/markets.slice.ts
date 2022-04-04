import { builder } from "@netlify/functions";
import { createSlice } from "@reduxjs/toolkit";
import { ActiveTokensEnum } from "config/tokens";
import { getMarketPrices } from "./markets.thunks";
import { MarketSlice } from "./markets.type";

const initialState: MarketSlice = {
    markets: {
        [ActiveTokensEnum.DAI]: null,
    },
    loading: true,
};

export const marketSlice = createSlice({
    name: "market-slice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getMarketPrices.fulfilled, (state, action) => {
                console.log("here", action.payload);
                return {
                    markets: action.payload,
                    loading: false,
                };
            })
            .addCase(getMarketPrices.rejected, (state, action) => {
                console.error("API not available");
            });
    },
});

export const selectMarkets = (state: MarketSlice) => state.markets;

export default marketSlice.reducer;
