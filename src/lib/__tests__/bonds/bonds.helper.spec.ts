import { Networks } from 'constants/blockchain';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { createBond, getBondContractsAddresses } from 'lib/bonds/bonds.helper';
import { BondType } from 'lib/bonds/bonds.types';

describe('#createBond', () => {
    it('throws an error if the bond type is not handled', () => {
        expect(() => createBond({} as BondOptions)).toThrowError('Undefined bond type');
    });

    it('instanciates a LP bond', () => {
        const bond = createBond({ type: BondType.LP } as BondOptions);

        expect(bond).toBeInstanceOf(LPBond);
    });

    it('instanciates a Stable bond', () => {
        const bond = createBond({ type: BondType.StableAsset } as BondOptions);

        expect(bond).toBeInstanceOf(StableBond);
    });
});

describe('#getBondContractsAddresses', () => {
    it('throws an error if the bond or reserve address is not found', () => {
        expect(() =>
            getBondContractsAddresses(
                {
                    addresses: {
                        [Networks.MAINNET]: { bondAddress: '', reserveAddress: '' },
                        [Networks.RINKEBY]: { bondAddress: '', reserveAddress: '' },
                        [Networks.LOCAL]: { bondAddress: '', reserveAddress: '' },
                    },
                } as any,
                Networks.MAINNET,
            ),
        ).toThrowError('Unable to get bond addresses');
    });

    it('returns the addresses', () => {
        const bondAddress = '0xBondAddress';
        const reserveAddress = '0xReserveAddress';
        const bondAddresses = {
            [Networks.MAINNET]: { bondAddress, reserveAddress },
            [Networks.RINKEBY]: { bondAddress: '', reserveAddress: '' },
            [Networks.LOCAL]: { bondAddress: '', reserveAddress: '' },
        };

        const addresses = getBondContractsAddresses({ addresses: bondAddresses } as any, Networks.MAINNET);

        expect(addresses.bondAddress).toEqual(bondAddress);
        expect(addresses.reserveAddress).toEqual(reserveAddress);
    });
});
