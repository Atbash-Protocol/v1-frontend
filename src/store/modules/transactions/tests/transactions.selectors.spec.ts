import { selectPendingTransactions, selectStakingPending, selectUnStakingPending } from '../transactions.selectors';
import { TransactionTypeEnum } from '../transactions.type';

describe('#selectPendingTransactions', () => {
    it.each([
        { transactions: [], expected: [] },
        { transactions: [{ status: 'DONE' }], expected: [] },
    ])('returns the pending transactions', ({ transactions, expected }) => {
        expect(selectPendingTransactions({ transactions } as any)).toEqual(expected);
    });
});

describe('#selectStakingPending', () => {
    it.each([
        { transactions: [], expected: false },
        { transactions: [{ type: TransactionTypeEnum.BASH_APPROVAL, status: 'DONE' }], expected: false },
        { transactions: [{ type: TransactionTypeEnum.STAKE_PENDING, status: 'DONE' }], expected: false },
        { transactions: [{ type: TransactionTypeEnum.BASH_APPROVAL, status: 'PENDING' }], expected: true },
        { transactions: [{ type: TransactionTypeEnum.STAKE_PENDING, status: 'PENDING' }], expected: true },
        { transactions: [{ type: TransactionTypeEnum.BONDING, status: 'PENDING' }], expected: false },
        {
            transactions: [
                { type: TransactionTypeEnum.BONDING, status: 'PENDING' },
                { type: TransactionTypeEnum.BASH_APPROVAL, status: 'DONE' },
            ],
            expected: false,
        },
        {
            transactions: [
                { type: TransactionTypeEnum.BASH_APPROVAL, status: 'PENDING' },
                { type: TransactionTypeEnum.BONDING, status: 'DONE' },
            ],
            expected: true,
        },
    ])('returns the pending transactions', ({ transactions, expected }) => {
        expect(selectStakingPending({ transactions } as any)).toEqual(expected);
    });
});

describe('#selectUnStakingPending', () => {
    it.each([
        { transactions: [], expected: false },
        { transactions: [{ type: TransactionTypeEnum.SBASH_APPROVAL, status: 'DONE' }], expected: false },
        { transactions: [{ type: TransactionTypeEnum.UNSTAKE_PENDING, status: 'DONE' }], expected: false },
        { transactions: [{ type: TransactionTypeEnum.SBASH_APPROVAL, status: 'PENDING' }], expected: true },
        { transactions: [{ type: TransactionTypeEnum.UNSTAKE_PENDING, status: 'PENDING' }], expected: true },
        { transactions: [{ type: TransactionTypeEnum.BONDING, status: 'PENDING' }], expected: false },
        {
            transactions: [
                { type: TransactionTypeEnum.BONDING, status: 'PENDING' },
                { type: TransactionTypeEnum.SBASH_APPROVAL, status: 'DONE' },
            ],
            expected: false,
        },
        {
            transactions: [
                { type: TransactionTypeEnum.SBASH_APPROVAL, status: 'PENDING' },
                { type: TransactionTypeEnum.BONDING, status: 'DONE' },
            ],
            expected: true,
        },
    ])('returns the pending transactions', ({ transactions, expected }) => {
        expect(selectUnStakingPending({ transactions } as any)).toEqual(expected);
    });
});
