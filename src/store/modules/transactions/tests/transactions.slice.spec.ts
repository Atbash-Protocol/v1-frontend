import TransactionReducer, { addPendingTransaction, clearPendingTransaction } from '../transactions.slice';
import { Transaction, TransactionTypeEnum } from '../transactions.type';

describe('TransactionSlice', () => {
    const initialState = new Array<Transaction>();

    describe('#addPendingTransaction', () => {
        it('process a pending TX', () => {
            const action = { payload: { type: TransactionTypeEnum.APPROVE_CONTRACT, hash: '0xHash' } };
            const state = TransactionReducer(initialState, addPendingTransaction(action as any));

            expect(state).toEqual([
                {
                    payload: {
                        hash: '0xHash',
                        type: 'APPROVE_CONTRACT',
                    },
                    status: 'PENDING',
                },
            ]);
        });
    });

    describe('#clearPendingTransaction', () => {
        it('clears the pendingTxs', () => {
            const action = { type: TransactionTypeEnum.APPROVE_CONTRACT, hash: '0xHash' };
            const state = TransactionReducer(initialState, addPendingTransaction(action as any));

            expect(state).toEqual([
                {
                    hash: '0xHash',
                    type: 'APPROVE_CONTRACT',
                    status: 'PENDING',
                },
            ]);

            const clearAction = TransactionTypeEnum.APPROVE_CONTRACT;
            const newState = TransactionReducer(state, clearPendingTransaction(clearAction as any));

            expect(newState).toEqual([{ hash: '0xHash', type: 'APPROVE_CONTRACT', status: 'DONE' }]);
        });
    });
});
