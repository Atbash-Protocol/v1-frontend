import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/account-slice";
import bondingReducer from "./slices/bond-slice";
import appReducer from "./slices/app-slice";
import pendingTransactionsReducer from "./slices/pending-txns-slice";
import messagesReducer from "./slices/messages-slice";

import mainReducer from "./modules/app/app.slice";

const store = configureStore({
    reducer: {
        account: accountReducer,
        bonding: bondingReducer,
        app: appReducer,
        pendingTransactions: pendingTransactionsReducer,
        messages: messagesReducer,
        main: mainReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
