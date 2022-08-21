import { Dispatch } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { loadBalancesAndAllowances } from '../account.thunks';

describe('#loadBalancesAndAllowances', () => {
    it('returns the balances and allowances', async () => {
        const mockContract = (balance: number) => ({
            balanceOf: jest.fn().mockResolvedValue(ethers.BigNumber.from(balance)),
            allowance: jest.fn().mockResolvedValue(ethers.constants.MaxUint256),
        });
        const dispatch: Dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({
            main: {
                contracts: {
                    BASH_CONTRACT: mockContract(10),
                    SBASH_CONTRACT: mockContract(20),
                    STAKING_CONTRACT: mockContract(30),
                    STAKING_HELPER_CONTRACT: mockContract(0),
                },
            },
        });

        const action = await loadBalancesAndAllowances('address');

        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({
            balances: { BASH: ethers.BigNumber.from(10), SBASH: ethers.BigNumber.from(20), WSBASH: ethers.BigNumber.from(0) },
            stakingAllowance: {
                BASH: ethers.BigNumber.from(ethers.constants.MaxUint256),
                SBASH: ethers.BigNumber.from(ethers.constants.MaxUint256),
                WSBASH: ethers.BigNumber.from(ethers.constants.MaxUint256),
            },
        });
    });
});
