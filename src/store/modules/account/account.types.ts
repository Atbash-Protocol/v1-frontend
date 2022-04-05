export interface AccountSlice {
    stakingAllowance: {
        BASH: number;
        SBASH: number;
    };
    balances: {
        BASH: number;
        SBASH: number;
    };
    loading: boolean;
}
