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
        expect(calculator.address).toBe('0x7969c5eD335650692Bc04293B07F5BF2e7A673C0');
    });
});
