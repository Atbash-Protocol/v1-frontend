import Decimal from 'decimal.js';
import { ethers } from 'ethers';

import { RootState } from 'store/store';

import { selectBASHBalance, selectSBASHBalance, selectFormattedStakeBalance } from '../account.selectors';
import * as AccountModuleSelector from '../account.selectors';

describe('#selectBASHBalance', () => {
    it('returns a formatted balance', () => {
        expect(selectBASHBalance({ account: { balances: { BASH: ethers.BigNumber.from(10000000000) } } } as RootState)).toEqual(10);
    });
});

describe('#selectSBASHBalance', () => {
    it('returns a formatted balance', () => {
        expect(selectSBASHBalance({ account: { balances: { SBASH: ethers.BigNumber.from(10000000000) } } } as RootState)).toEqual(expect.any(Decimal));
    });
});

describe('#selectFormattedStakeBalance', () => {
    it('returns a formatted balance of all balances', () => {
        expect(
            selectFormattedStakeBalance({
                account: { balances: { BASH: ethers.BigNumber.from(10000000000), SBASH: ethers.BigNumber.from(20000000000), WSBASH: ethers.BigNumber.from(30000000000) } },
            } as any),
        ).toEqual({
            BASH: '10.00 BASH',
            SBASH: '20.00 SBASH',
            WSBASH: '30.00 WSBASH',
        });
    });
});
