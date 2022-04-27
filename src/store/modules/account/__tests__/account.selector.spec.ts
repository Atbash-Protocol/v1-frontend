import { ethers } from 'ethers';

import { RootState } from 'store/store';

import { selectBASHBalance, selectSBASHBalance, selectFormattedStakeBalance } from '../account.selectors';

describe('#selectBASHBalance', () => {
    it('returns a formatted balance', () => {
        expect(selectBASHBalance({ accountNew: { balances: { BASH: ethers.BigNumber.from(10000000000) } } } as RootState)).toEqual(10);
    });
});

describe('#selectSBASHBalance', () => {
    it('returns a formatted balance', () => {
        expect(selectSBASHBalance({ accountNew: { balances: { SBASH: ethers.BigNumber.from(10000000000) } } } as RootState)).toEqual(10);
    });
});

describe('#selectFormattedStakeBalance', () => {
    it('returns a formatted balance of all balances', () => {
        expect(
            selectFormattedStakeBalance({
                accountNew: { balances: { BASH: ethers.BigNumber.from(10000000000), SBASH: ethers.BigNumber.from(20000000000) }, WSBASH: ethers.BigNumber.from(30000000000) },
            } as any),
        ).toEqual({
            balances: {
                BASH: 10,
                SBASH: 20,
                WSBASH: 0,
            },
        });
    });
});
