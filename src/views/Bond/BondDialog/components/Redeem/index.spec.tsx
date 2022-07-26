import { fireEvent, render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import * as ReactReduxModule from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { ContractEnum } from 'store/modules/app/app.types';

import Redeem from '.';

jest.mock('../BondPurchase', () => () => <> Bond Purchase</>);

const renderComponent = (component: JSX.Element, state: any, contextState?: any) => {
    const middlewares = [thunk];
    const mockStore = createMockStore(middlewares);
    const store = mockStore(state);

    const container = render(
        <Web3Context.Provider value={contextState}>
            <ReactReduxModule.Provider store={store}>{component}</ReactReduxModule.Provider>)
        </Web3Context.Provider>,
    );

    return { container, store };
};

describe('Redeem', () => {
    describe('when the state is not ready', () => {
        it('returns the loader', () => {
            const state = {
                bonds: {
                    bondMetrics: {},
                    bondInstances: {},
                },
                main: {
                    contracts: {},
                },
            };
            const { container } = renderComponent(<Redeem bondID="dai" recipientAddress="0x" />, state);

            expect(container.container.getElementsByClassName('MuiCircularProgress-root')).toHaveLength(1);
        });
    });

    describe('When the state is ready', () => {
        it('returns the Redeem component', () => {
            const state = {
                bonds: {
                    bondMetrics: {
                        dai: {},
                    },
                    bondInstances: {},
                    bondQuote: {
                        interestDue: 0,
                    },
                },
                main: {
                    blockchain: {
                        timestamp: DateTime.utc().toMillis(),
                    },
                    contracts: {
                        [ContractEnum.BASH_CONTRACT]: jest.fn(),
                    },
                },
                transactions: [],
            };

            const contextState = { state: { networkID: 1, signer: jest.fn() } };

            const { container, store } = renderComponent(<Redeem bondID="dai" recipientAddress="0x" />, state, contextState);

            expect(container.container).toMatchSnapshot();
            expect(store.getActions()).toHaveLength(1);

            const btns = screen.getAllByText(/bond:Claim/i);
            expect(btns).toHaveLength(2);

            fireEvent.click(btns[0]);

            expect(store.getActions().at(1)).toEqual({
                type: 'bonds/redeem/pending',
                payload: undefined,
                meta: {
                    arg: {
                        bondID: 'dai',
                        isAutoStake: false,
                        recipientAddress: '0x',
                        signer: expect.anything(),
                    },
                    requestId: expect.any(String),
                    requestStatus: 'pending',
                },
            });

            fireEvent.click(btns[1]);
            expect(store.getActions()).toHaveLength(3);
            expect(store.getActions().at(2)).toEqual({
                type: 'bonds/redeem/pending',
                payload: undefined,
                meta: {
                    arg: {
                        bondID: 'dai',

                        isAutoStake: true,
                        recipientAddress: '0x',
                        signer: expect.anything(),
                    },
                    requestId: expect.any(String),
                    requestStatus: 'pending',
                },
            });
        });
    });
});
