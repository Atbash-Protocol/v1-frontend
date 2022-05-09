import { IReduxState } from 'store/slices/state.interface';

import { TransactionType } from './transactions.type';

export const selectPendingTx = (state: IReduxState, type: TransactionType): boolean => {
    const tx = state.transactions.find(t => t.type === type);

    return !tx ? false : true;
};

export const selectTransactionPending = (state: IReduxState) => state.transactions.length > 0;
