import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Transaction } from './transactions.type';

const initialState = new Array<Transaction>();

const pendingTxnsSlice = createSlice({
    name: 'pendingTransactions',
    initialState,
    reducers: {
        addPendingTransaction(state, action: PayloadAction<Pick<Transaction, 'hash' | 'type'>>) {
            state.push({ ...action.payload, status: 'PENDING' });
        },
        clearPendingTransaction(state, action: PayloadAction<string>) {
            const target = state.find(x => x.hash === action.payload);
            if (target) {
                target.status = 'DONE';
            }
        },
    },
});

export const { addPendingTransaction, clearPendingTransaction } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
