import { render, screen } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import * as BondSelectorModule from 'store/modules/bonds/bonds.selector';

import BondListItem from './BondListItem';

const renderComponent = (props: any, state: any, providerValue: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);

    const component = render(
        <BrowserRouter>
            <Web3Context.Provider value={providerValue as any}>
                <Provider store={store}>
                    <BondListItem {...props} />
                </Provider>
            </Web3Context.Provider>
        </BrowserRouter>,
    );

    return {
        component,
        store,
    };
};

describe('BondListItem', () => {
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
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    describe('When the state is not ready', () => {
        it('returns the loader', () => {
            jest.spyOn(BondSelectorModule, 'selectBondInstance').mockReturnValue(null);
            jest.spyOn(BondSelectorModule, 'selectBondItemMetrics').mockReturnValue({} as any);
            const {
                component: { container },
            } = renderComponent({ bondID: 'dai' }, {}, providerValue);

            expect(container.querySelectorAll('.MuiCircularProgress-root').length).not.toBe(0);
        });
    });

    describe('When state is ready', () => {
        const bond = {
            bondOptions,
            isLP: jest.fn(),
        } as any;

        it('Offers the mint if bond is active', () => {
            jest.spyOn(BondSelectorModule, 'selectBondInstance').mockReturnValue({
                ...bond,
                bondOptions: {
                    ...bondOptions,
                    isActive: true,
                },
            });
            jest.spyOn(BondSelectorModule, 'selectBondItemMetrics').mockReturnValue({ bondDiscount: new Decimal('10.20') } as any);

            renderComponent({ bondID: 'dai', bond: { bondOptions } }, {}, providerValue);

            expect(screen.getByText(/bond:MintBond/i)).toBeDefined();
        });

        it('Offers the redeem if bond is active', () => {
            jest.spyOn(BondSelectorModule, 'selectBondInstance').mockReturnValue({
                ...bond,
                bondOptions: {
                    ...bondOptions,
                    isActive: false,
                },
            });
            jest.spyOn(BondSelectorModule, 'selectBondItemMetrics').mockReturnValue({ bondDiscount: new Decimal(100.2) } as any);

            renderComponent({ bondID: 'dai', bond: { bondOptions } }, {}, providerValue);

            expect(screen.getByText(/bond:RedeemBond/i)).toBeDefined();
        });

        it('does not show the actions if user is not connected', async () => {
            jest.spyOn(BondSelectorModule, 'selectBondInstance').mockReturnValue({
                ...bond,
                bondOptions: {
                    ...bondOptions,
                    isActive: false,
                },
            });
            jest.spyOn(BondSelectorModule, 'selectBondItemMetrics').mockReturnValue({ bondDiscount: new Decimal(100.89) } as any);

            const {
                component: { container },
            } = renderComponent({ bondID: 'dai', bond: { bondOptions } }, {}, { ...providerValue, state: { ...providerValue.state, signer: null } });

            expect(container.querySelector('.Mui-Link')).toBeNull();
        });
    });
});
