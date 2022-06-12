import * as ethersProjectModule from '@ethersproject/address';
import { hasExpectedRequestMetadata } from '@reduxjs/toolkit/dist/matchers';
import { BigNumber, Contract, providers } from 'ethers';

import { Networks } from 'constants/blockchain';
import { BondType, BondAddresses } from 'helpers/bond/constants';
import { BondProviderEnum } from 'lib/bonds/bonds.types';

import { BondOptions } from '../bond';
import { StableBond } from '../stable-bond';

class TestBond extends StableBond {
    public initializeContracts(bondAddresses: BondAddresses): void {
        super.initializeContracts(bondAddresses, undefined as any);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        return super.getTreasuryBalance(bondCalculatorContract, treasuryAddress);
    }

    public getTokenAmount() {
        return super.getTokenAmount();
    }

    public getSbAmount() {
        return super.getSbAmount();
    }

    // only for mocking purposes
    public getReserveContract() {
        return super.getReserveContract();
    }
}

describe('TestBond', () => {
    const bondOptions: BondOptions = {
        name: 'bond',
        displayName: 'bondToDisplay',
        token: 'token',
        iconPath: 'path',
        lpProvider: BondProviderEnum.UNISWAP_V2,
        type: BondType.STABLE_ASSET,
        networkID: 2,
        isActive: true,
    };

    let testBond: TestBond;

    beforeEach(() => {
        testBond = new TestBond(bondOptions);
    });

    describe('#initializeContracts', () => {
        it('initializes contracts', () => {
            const bond = new TestBond(bondOptions);
            const getAddressSpy = jest.spyOn(ethersProjectModule, 'getAddress').mockReturnValue('0x'); // mock ethers.Contract lib call

            const contracts = { bondAddress: '0xBondAddress', reserveAddress: '0xReserveAddress' };

            bond.initializeContracts(contracts);

            expect(bond.getBondContract()).toBeInstanceOf(Contract);
            expect(bond.getBondContract().address).toBe('0xBondAddress');
            expect(bond.getReserveContract()).toBeInstanceOf(Contract);
            expect(bond.getReserveContract().address).toBe('0xReserveAddress');
        });
    });

    describe('#getTreasuryBalance', () => {
        beforeEach(() => {
            const getAddressSpy = jest.spyOn(ethersProjectModule, 'getAddress').mockReturnValue('0x8461bc7894b052eb32b4986810b5c47fbf975b4e'); // mock ethers.Contract lib call
            const contracts = { bondAddress: '0xBondAddress', reserveAddress: '0xReserveAddress' };
            testBond.initializeContracts(contracts);
        });

        it('returns the treasury balance', async () => {
            jest.spyOn(testBond, 'getReserveContract').mockReturnValue({ balanceOf: jest.fn().mockResolvedValue(BigNumber.from(120 * 10 ** 9)) } as any);

            const bondCalculatorContract = {};

            const treasury = await testBond.getTreasuryBalance(bondCalculatorContract as any, '0x');

            expect(treasury).toBe((120 * 10 ** 9) / 10 ** 18);
        });
    });

    describe('#getTokenAmount', () => {
        it('returns the amount of tokens in reserves', async () => {
            await expect(testBond.getTokenAmount()).resolves.toEqual(0);
        });
    });

    describe('#getSbAmount', () => {
        it('returns the amount of Staked token in reserves', async () => {
            await expect(testBond.getSbAmount()).resolves.toEqual(0);
        });
    });
});
