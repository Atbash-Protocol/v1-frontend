export const TransactionTypeEnum = {
    APPROVE_CONTRACT: 'APPROVE_CONTRACT',
    STAKE_PENDING: 'STAKE_PENDING',
    UNSTAKE_PENDING: 'UNSTAKE_PENDING',
    BASH_APPROVAL: 'BASH_APPROVAL',
    SBASH_APPROVAL: 'SBASH_APPROVAL',
    BONDING: 'BONDING',
    REDEEMING: 'REDEEMING',
    REDEEMING_STAKING: 'REDEEMING_STAKING',
} as const;

export type TransactionType = typeof TransactionTypeEnum[keyof typeof TransactionTypeEnum];

export interface Transaction {
    hash: string;
    type: TransactionType;
    status: 'PENDING' | 'DONE';
}
