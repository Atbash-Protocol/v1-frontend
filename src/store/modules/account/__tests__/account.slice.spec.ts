import { BigNumber } from 'ethers';

import MarketReducer from '../account.slice';
import { loadBalancesAndAllowances } from '../account.thunks';
import { AccountSlice } from '../account.types';

describe('MarketReducer', () => {
    const initialState: AccountSlice = {
        balances: {
            BASH: BigNumber.from(0),
            SBASH: BigNumber.from(0),
            WSBASH: BigNumber.from(0),
        },
        stakingAllowance: {
            BASH: BigNumber.from(0),
            SBASH: BigNumber.from(0),
        },
        loading: true,
    };
    it('reduces fulfilled action', () => {
        const action = { type: loadBalancesAndAllowances.fulfilled, payload: {} };
        const state = MarketReducer(initialState, action);

        expect(state).toEqual({ ...initialState, loading: false });
    });
});
