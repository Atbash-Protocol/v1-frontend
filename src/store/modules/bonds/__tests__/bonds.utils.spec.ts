import { BigNumber } from 'ethers';

import { getLPBondQuote, getLPPurchasedBonds, getTokenBondQuote, getTokenPurchaseBonds } from '../bonds.utils';

describe('#getLPBondQuote', () => {
    it('quotes the bond', async () => {
        const bond = {
            getBondAddresses: () => ({
                reserveAddress: '0xReserve',
            }),
            getBondContract: () => ({
                payoutFor: jest.fn().mockImplementation(amount => Promise.resolve(amount)),
            }),
        } as any;
        const bondCalculator = {
            valuation: jest.fn().mockResolvedValue(BigNumber.from(100_000_000_000)),
        } as any;

        await expect(getLPBondQuote(bond, BigNumber.from(1000), bondCalculator, 100000)).resolves.toEqual({ bondQuote: 100, maxBondPriceToken: 1000000000000 });
    });
});

describe('#getTokenBondQuote', () => {
    it('quotes the bond', async () => {
        const payoutForMock = jest.fn().mockImplementation(amount => Promise.resolve(amount));
        const bond = {
            getBondContract: () => ({
                payoutFor: payoutForMock,
            }),
        } as any;

        await expect(getTokenBondQuote(bond, BigNumber.from(100_000_000_000_000), 100_000_000_000_000_000)).resolves.toEqual({ bondQuote: 0.0001, maxBondPriceToken: 0.1 });
        expect(payoutForMock).toHaveBeenCalledWith(BigNumber.from(100_000_000_000_000));
    });
});

describe('#getLPPurchasedBonds', () => {
    it('returns the purchased', async () => {
        const bond = {
            getReserveContract: () => ({
                address: '0xAddress',
            }),
            isCustomBond: () => false,
        } as any;

        const bondCalculator = {
            valuation: jest.fn().mockResolvedValue(BigNumber.from(100_000_000_000)),
            markdown: jest.fn().mockResolvedValue(BigNumber.from(100_000_000_000_000)),
        } as any;

        await expect(getLPPurchasedBonds(bond, bondCalculator, BigNumber.from(100_000_000_000), 1.01)).resolves.toEqual({ purchased: 0.01 });
    });

    it('uses the daiPrice if the bond is custom', async () => {
        const bond = {
            getReserveContract: () => ({
                address: '0xAddress',
            }),
            isCustomBond: () => true,
        } as any;

        const bondCalculator = {
            valuation: jest.fn().mockResolvedValue(BigNumber.from(100_000_000_000)),
            markdown: jest.fn().mockResolvedValue(BigNumber.from(100_000_000_000_000)),
        } as any;

        await expect(getLPPurchasedBonds(bond, bondCalculator, BigNumber.from(100_000_000_000), 1.02)).resolves.toEqual({ purchased: 0.0102 });

        expect(bondCalculator.valuation).toHaveBeenCalledWith('0xAddress', '100000000000');
        expect(bondCalculator.markdown).toHaveBeenCalledWith('0xAddress');
    });
});

describe('#getTokenPurchaseBonds', () => {
    it('returns the purchased', async () => {
        const bond = {
            isCustomBond: () => false,
        } as any;
        await expect(getTokenPurchaseBonds(bond, {} as any, 100_000_000_000_000_000, 1.04)).resolves.toEqual({ purchased: 0.1 });
    });

    it('uses the daiPrice if bond is custom', async () => {
        const bond = {
            isCustomBond: () => true,
        } as any;
        await expect(getTokenPurchaseBonds(bond, {} as any, 100_000_000_000_000_000, 1.04)).resolves.toEqual({ purchased: 0.104 });
    });
});
