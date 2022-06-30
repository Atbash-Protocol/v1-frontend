import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import * as BondSelectorModule from 'store/modules/bonds/bonds.selector';
import * as MarketsSelectorModule from 'store/modules/markets/markets.selectors';

jest.mock('./BondListItem', () => (bond: any) => {
    return <p> {bond.ID} </p>;
});

import BondList from './BondList';

const renderComponent = (state: any, providerValue: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);

    const component = render(
        <BrowserRouter>
            <Web3Context.Provider value={providerValue as any}>
                <Provider store={store}>
                    <BondList />
                </Provider>
            </Web3Context.Provider>
        </BrowserRouter>,
    );

    return {
        component,
        store,
    };
};

describe('BondList', () => {
    describe('When state is ready', () => {
        beforeEach(() => {
            jest.spyOn(BondSelectorModule, 'selectAllBonds').mockReturnValue({ activeBonds: [{ ID: 'DAI' }], inactiveBonds: [{ ID: 'DAI-inactive' }] } as any);
            jest.spyOn(BondSelectorModule, 'selectBondsReady').mockReturnValue(true);
            jest.spyOn(BondSelectorModule, 'selectFormattedTreasuryBalance').mockReturnValue('$20.00');
            jest.spyOn(MarketsSelectorModule, 'selectFormattedBashBalance').mockReturnValue('$2.00');
        });

        it('dispatchs the details if metrics and bond are set', () => {
            const { store } = renderComponent({}, { state: { networkID: 2 } });

            expect(store.getActions()).toHaveLength(1);
            expect(store.getActions()[0]).toEqual(
                expect.objectContaining({
                    payload: undefined,
                    type: 'bonds/bonds-metrics/pending',
                }),
            );
        });

        it('displays inactive and active bonds', () => {
            renderComponent({}, { state: { networkID: 2 } });

            expect(screen.findAllByText('DAI')).toBeDefined();
            expect(screen.findAllByText('DAI-inactive')).toBeDefined();
        });
    });
});
