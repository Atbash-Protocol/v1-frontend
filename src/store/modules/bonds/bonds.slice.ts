import { createSlice } from "@reduxjs/toolkit";
import { initializeBonds } from "./bonds.thunks";

// Define the initial state using that type
const initialState = {};

export const MainSlice = createSlice({
    name: "app-main",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeBonds.fulfilled, (state, action) => {
            return state;
        });
    },
});

export default MainSlice.reducer;
