import * as ethersProjectModule from '@ethersproject/address';
import { hasExpectedRequestMetadata } from '@reduxjs/toolkit/dist/matchers';
import { BigNumber, Contract, providers } from 'ethers';

import { Networks } from 'constants/blockchain';
import { BondType, BondAddresses } from 'helpers/bond/constants';
import { BondProviderEnum } from 'lib/bonds/bonds.types';

import { BondOptions } from '../bond';
import { LPBond } from '../lp-bond';

class TestBond extends LPBond {
    public initializeContracts(bondAddresses: BondAddresses): void {
        super.initializeContracts(bondAddresses, undefined as any);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        return super.getTreasuryBalance(bondCalculatorContract, treasuryAddress);
    }

    public getTokenAmount(BASH_ADDRESS: string) {
        return super.getTokenAmount(BASH_ADDRESS);
    }

    public getSbAmount(BASH_ADDRESS: string) {
        return super.getSbAmount(BASH_ADDRESS);
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
        type: BondType.LP,
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

            const bondCalculatorContract = {
                markdown: jest.fn().mockResolvedValue(BigNumber.from('0x7dab32f479370c2b')), // 9055387501345573931 WEI
                valuation: jest.fn().mockResolvedValue(BigNumber.from('0x149ffa090692')), // 22677327251090 WEI
            };

            const treasury = await testBond.getTreasuryBalance(bondCalculatorContract as any, '0x');

            expect(treasury).toBe(205351.98575344376);
        });
    });

    describe('#getTokenAmount', () => {
        it('returns the amount of tokens in reserves', async () => {
            jest.spyOn(testBond, 'getReserveContract').mockReturnValue({
                balanceOf: jest.fn().mockResolvedValue(BigNumber.from(120 * 10 ** 9)),
                getReserves: jest.fn().mockResolvedValue([BigNumber.from(100 * 10 ** 9), BigNumber.from(300 * 10 ** 9)]),
                token1: jest.fn().mockResolvedValue('0xBASH_ADDRESS'),
            } as any);

            await expect(testBond.getTokenAmount('0x')).resolves.toEqual(3e-7);
        });
    });

    describe('#getSbAmount', () => {
        it('returns the amount of Staked token in reserves', async () => {
            jest.spyOn(testBond, 'getReserveContract').mockReturnValue({
                balanceOf: jest.fn().mockResolvedValue(BigNumber.from(120 * 10 ** 9)),
                getReserves: jest.fn().mockResolvedValue([BigNumber.from(100 * 10 ** 9), BigNumber.from(300 * 10 ** 9)]),
                token1: jest.fn().mockResolvedValue('0xBASH_ADDRESS'),
            } as any);

            await expect(testBond.getSbAmount('0xBASH_ADDRESS')).resolves.toEqual(300);
        });
    });
});
