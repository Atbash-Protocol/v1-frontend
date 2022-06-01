import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Transaction, TransactionType } from './transactions.type';

const initialState = new Array<Transaction>();

const pendingTxnsSlice = createSlice({
    name: 'pendingTransactions',
    initialState,
    reducers: {
        addPendingTransaction(state, action: PayloadAction<Pick<Transaction, 'hash' | 'type'>>) {
            state.push({ ...action.payload, status: 'PENDING' });
        },
        clearPendingTransaction(state, action: PayloadAction<TransactionType>) {
            const target = state.find(x => x.type === action.payload);
            if (target) {
                target.status = 'DONE';
                state.splice(state.indexOf(target), 1); // todo: ?
            }
        },
    },
});

export const { addPendingTransaction, clearPendingTransaction } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
