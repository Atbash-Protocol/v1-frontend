import Decimal from 'decimal.js';
import { ethers } from 'ethers';

import { selectAllActiveBondsIds, selectAllBonds, selectBondInfos, selectBondMetrics, selectBondMintingMetrics } from '../bonds.selector';

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
            bondDiscount: new Decimal(8.1),
            bondPrice: ethers.BigNumber.from(10),
            allowance: null,
            vestingTerm: null,
            purchased: 20,
            maxBondPrice: 30,
        };

        expect(selectBondMintingMetrics(metrics as any)).toEqual({
            allowance: null,
            bondDiscount: '810.00 %',
            bondPrice: '$0.00',
            maxBondPrice: 30,
            purchased: '$20',
            vestingTerm: null,
            bondSoldOut: false,
        });
    });
});

describe('#selectAllActiveBondsIds', () => {
    it('returns the active bonds IDs', () => {
        const state = {
            bonds: {
                bondInstances: {
                    dai: { bondOptions: { isActive: true, name: 'dai' }, ID: 'dai' },
                    'dai-lp': { bondOptions: { isActive: true, name: 'dai-lp' }, ID: 'dai-lp' },
                    'dai-inactive': { bondOptions: { isActive: false, name: 'dai-inactive' }, ID: 'dai-inactive' },
                },
            },
        };

        expect(selectAllActiveBondsIds(state as any)).toEqual(['dai', 'dai-lp']);
    });
});

describe('#selectBondMetrics', () => {
    it('returns the bondMetrics', () => {
        const state = {
            bonds: {
                bondMetrics: {
                    dai: { bondDiscount: new Decimal(8.1) },
                    usdc: { bondDiscount: new Decimal(10.1) },
                },
            },
        };

        expect(selectBondMetrics(state as any)).toEqual([{ bondDiscount: new Decimal(8.1) }, { bondDiscount: new Decimal(10.1) }]);
    });
});
