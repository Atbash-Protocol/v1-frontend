export enum StakeActionEnum {
    STAKE = 'STAKE',
    UNSTAKE = 'UNSTAKE',
}

export interface ChangeStakeOptions {
    action: StakeActionEnum;
    amount: number;
}
