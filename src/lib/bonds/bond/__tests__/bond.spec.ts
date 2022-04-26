import { ethers } from 'ethers';

import { BondProviderEnum, BondType } from 'lib/bonds/bonds.types';

import { Bond, BondOptions } from '../bond';

class TestBond extends Bond {
    public getTreasuryBalance(bondCalculatorContract: ethers.Contract, treasuryAddress: string): Promise<number> {
        return Promise.resolve(0);
    }

    public getTokenAmount(): Promise<number> {
        return Promise.resolve(0);
    }

    public getSbAmount(BASH_ADDRESS: string): Promise<number> {
        return Promise.resolve(0);
    }
}

describe('TestBond', () => {
    const bondOptions: BondOptions = {
        name: 'bond',
        displayName: 'bondToDisplay',
        token: 'token',
        iconPath: 'path',
        lpProvider: BondProviderEnum.UNISWAP_V2,
        type: BondType.LP,
        networkID: 2,
        isActive: true,
    };

    const testBond = new TestBond(bondOptions);

    describe('#isLP', () => {
        it('returns true if type of bond is LP', () => {
            const lpBond = new TestBond({ ...bondOptions, type: BondType.LP });
            expect(lpBond.isLP()).toBeTruthy();

            const otherBond = new TestBond({ ...bondOptions, type: BondType.CUSTOM });
            expect(otherBond.isLP()).toBeFalsy();
        });
    });

    describe('#getLPPProvider', () => {
        it('throws an error if the LP provider is not found', () => {
            const bondWithProviderError = new TestBond({
                ...bondOptions,
                lpProvider: 'unknown' as BondProviderEnum,
            });

            jest.spyOn(bondWithProviderError, 'getBondAddresses').mockReturnValue({
                bondAddress: 'bondAddress',
                reserveAddress: 'reserveAddress',
            });

            expect(() => bondWithProviderError.getLPProvider()).toThrowError(`This LP Provider is not handled : "unknown"`);
        });

        it('returns the provider', () => {
            jest.spyOn(testBond, 'getBondAddresses').mockReturnValue({
                bondAddress: 'bondAddress',
                reserveAddress: 'reserveAddress',
            });

            expect(testBond.getLPProvider()).toEqual(`${BondProviderEnum.UNISWAP_V2}/bondAddress/reserveAddress`);
        });
    });
});
