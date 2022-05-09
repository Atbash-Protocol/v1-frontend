import { configureStore } from '@reduxjs/toolkit';

import newAccountReducer from './modules/account/account.slice';
import mainReducer from './modules/app/app.slice';
import boundReducer from './modules/bonds/bonds.slice';
import marketReducer from './modules/markets/markets.slice';
import messagesReducer from './modules/messages/messages.slice';
import transactionsReducer from './modules/transactions/transactions.slice';

const store = configureStore({
    reducer: {
        bonds: boundReducer,
        messages: messagesReducer,
        main: mainReducer,
        markets: marketReducer,
        account: newAccountReducer,
        transactions: transactionsReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
