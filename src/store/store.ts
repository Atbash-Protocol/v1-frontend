import { configureStore } from "@reduxjs/toolkit";

import pendingTransactionsReducer from "./slices/pending-txns-slice";
import messagesReducer from "./slices/messages-slice";

import mainReducer from "./modules/app/app.slice";
import marketReducer from "./modules/markets/markets.slice";
import newAccountReducer from "./modules/account/account.slice";
import boundReducer from "./modules/bonds/bonds.slice";

const store = configureStore({
    reducer: {
        bonds: boundReducer,
        pendingTransactions: pendingTransactionsReducer,
        messages: messagesReducer,
        main: mainReducer,
        markets: marketReducer,
        accountNew: newAccountReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
