export const TransactionTypeEnum = {
    APPROVE_CONTRACT: 'APPROVE_CONTRACT',
    STAKING_APPROVAL: 'STAKING_APPROVAL',
    STAKING_PENDING: 'STAKING_PENDING',
    BASH_APPROVAL: 'BASH_APPROVAL',
    SBASH_APPROVAL: 'SBASH_APPROVAL',
    BONDING: 'BONDING',
} as const;

export type TransactionType = typeof TransactionTypeEnum[keyof typeof TransactionTypeEnum];

export interface Transaction {
    hash: string;
    type: TransactionType;
    status: 'PENDING' | 'DONE';
}
