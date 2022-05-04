import { experimental_extendTheme } from '@mui/material';
import { LpBondContract, LpReserveContract } from 'abi';
import { Contract, ethers, providers } from 'ethers';

import { BondAddresses, BondProviderEnum, BondType } from 'lib/bonds/bonds.types';

import { Bond, BondOptions } from '../bond';

import * as ethers2 from '@ethersproject/address';
import { JsonRpcSigner } from '@ethersproject/providers';

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

    public getReserveContract(): ReturnType<Bond['getReserveContract']> {
        return super.getReserveContract();
    }

    public getBondAddresses(): ReturnType<Bond['getBondAddresses']> {
        return super.getBondAddresses();
    }

    public initializeContracts({ bondAddress, reserveAddress }: BondAddresses): void {
        this.bondContract = new Contract(bondAddress, LpBondContract);
        this.reserveContract = new Contract(reserveAddress, LpReserveContract);
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

    describe.only('#getBondContract', () => {
        it('throws an error if the contract is not defined', () => {
            expect(() => testBond.getBondContract()).toThrowError(`Bond contract for bond "bond" is undefined`);
        });

        it('returns the bondContract', () => {
            const getAddressSpy = jest.spyOn(ethers2, 'getAddress').mockReturnValue('0x'); // mock ethers.Contract lib call

            testBond.initializeContracts({ bondAddress: '0xBondAddress', reserveAddress: '0xReserveAddress' });

            expect(getAddressSpy).toHaveBeenCalled();
            expect(getAddressSpy).toHaveBeenCalledTimes(2);
            expect(getAddressSpy).toHaveBeenNthCalledWith(1, '0xBondAddress');
            expect(getAddressSpy).toHaveBeenNthCalledWith(2, '0xReserveAddress');
            expect(testBond.getBondContract()).toBeInstanceOf(Contract);
            expect(testBond.getBondContract().address).toEqual('0xBondAddress');
        });
    });
});
