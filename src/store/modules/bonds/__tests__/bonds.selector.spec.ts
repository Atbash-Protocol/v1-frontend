import { ethers } from 'ethers';

import { selectAllBonds, selectBondInfos, selectBondMintingMetrics } from '../bonds.selector';

describe('selectAllBonds', () => {
    it('returns the active and inactiveBonds', () => {
        const state = {
            bonds: {
                bondInstances: {
                    dai: { bondOptions: { isActive: true, name: 'dai' } },
                    'dai-inactive': { bondOptions: { isActive: false, name: 'dai-inactive' } },
                },
            },
        };

        const { activeBonds, inactiveBonds } = selectAllBonds(state as any);

        expect(activeBonds).toHaveLength(1);
        expect(inactiveBonds).toHaveLength(1);
    });
});

describe('selectBondInfos', () => {
    it('returns null if bonds infos cant be found', () => {
        const bonds = {};

        expect(selectBondInfos(bonds, 'dai-bond')).toBeNull();
    });

    it('returns the bond infos', () => {
        const bonds = { 'dai-bond': {} as any };

        expect(selectBondInfos(bonds, 'dai-bond')).not.toBeNull();
    });
});

describe('selectBondMintingMetrics', () => {
    it('returns the formatted metrics', () => {
        const metrics = {
            bondDiscount: 8.1,
            bondPrice: ethers.BigNumber.from(10),
            allowance: null,
            vestingTerm: null,
            purchased: 20,
            maxBondPrice: 30,
        };

        expect(selectBondMintingMetrics(metrics as any)).toEqual({
            allowance: null,
            bondDiscount: '810 %',
            bondPrice: '$0.00',
            maxBondPrice: 30,
            purchased: '$20',
            vestingTerm: null,
            bondSoldOut: false,
        });
    });
});
