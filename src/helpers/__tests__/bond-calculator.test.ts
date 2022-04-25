import * as ProviderModule from '@ethersproject/abstract-provider';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

import { Networks } from 'constants/blockchain';
import { getBondCalculator } from 'helpers/bond-calculator';

describe('#getBondCalculator', () => {
    it('returns the correct bond calculator', () => {
        jest.spyOn(ProviderModule.Provider, 'isProvider').mockReturnValue(true);

        const calculator = getBondCalculator(Networks.LOCAL, {} as StaticJsonRpcProvider);

        expect(calculator).toBeInstanceOf(ethers.Contract);
        expect(calculator.address).toBe('0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6');
    });
});
