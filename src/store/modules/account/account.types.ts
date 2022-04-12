import { ethers } from "ethers";

export interface AccountSlice {
    stakingAllowance: {
        BASH: ethers.BigNumber;
        SBASH: ethers.BigNumber;
    };
    balances: {
        BASH: ethers.BigNumber;
        SBASH: ethers.BigNumber;
        WSBASH: ethers.BigNumber;
    };
    loading: boolean;
}
