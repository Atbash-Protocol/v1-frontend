import { render, screen } from '@testing-library/react';
import * as ReactReduxModule from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ContractEnum } from 'store/modules/app/app.types';

import Mint from '.';

jest.mock('../BondPurchase', () => () => <> Bond Purchase</>);

const renderComponent = (component: JSX.Element, state: any) => {
    const middlewares = [thunk];
    const mockStore = createMockStore(middlewares);

    return render(<ReactReduxModule.Provider store={mockStore(state)}>{component}</ReactReduxModule.Provider>);
};

describe('Mint', () => {
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
            const { container } = renderComponent(<Mint bondID="dai" slippage={0.5} recipientAddress="0x" />, state);

            expect(container.getElementsByClassName('MuiCircularProgress-root')).toHaveLength(1);
        });
    });

    describe('When the state is ready', () => {
        it('returns the Mint component', () => {
            const state = {
                bonds: {
                    bondMetrics: {
                        dai: {},
                    },
                    bondInstances: {},
                },
                main: {
                    contracts: {
                        [ContractEnum.BASH_CONTRACT]: jest.fn(),
                    },
                },
            };
            const { container } = renderComponent(<Mint bondID="dai" slippage={0.5} recipientAddress="0x" />, state);

            expect(container).toMatchSnapshot();
        });
    });
});
