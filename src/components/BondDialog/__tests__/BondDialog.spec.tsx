import { render } from '@testing-library/react';
import * as ReactReduxModule from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import * as BondsSeletorModule from 'store/modules/bonds/bonds.selector';
import store from 'store/store';

import BondDialog from '..';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <ReactReduxModule.Provider store={store}>{component}</ReactReduxModule.Provider>,
        </Web3Context.Provider>,
    );
}

describe('BondDialog', () => {
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

    const testBond = {
        bondInstance: new LPBond(bondOptions),
        metrics: {
            reserves: 0,
        },
        terms: {},
        bonds: {
            loading: false,
        },
    };

    it('should render AccessUnavailablePanel', () => {
        const middlewares = [thunk];

        const mockStore = createMockStore(middlewares);

        const state = {
            bonds: {
                bondMetrics: {
                    dai: {
                        metric1: 'ok',
                    },
                },
                bondInstances: {
                    dai: new LPBond(bondOptions),
                },
                bondQuote: {
                    interestDue: null,
                    bondMaturationBlock: null,
                    pendingPayout: null,
                },
            },
            main: {
                metrics: {
                    reserves: 10000,
                },
                blockchain: {
                    timestamp: 10000,
                },
            },
            markets: {
                markets: {
                    dai: 1.01,
                },
            },
            transactions: [],
        };

        const testStore = mockStore(state);
        const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };
        render(<BondDialog open={true} bondID={'dai'} />, {
            wrapper: ({ children }) => (
                <Web3Context.Provider value={providerValue as any}>
                    <ReactReduxModule.Provider store={testStore}>{children}</ReactReduxModule.Provider>
                </Web3Context.Provider>
            ),
        });
        expect(testStore.getActions()).toHaveLength(4);
    });

    it('renders the loader', () => {
        jest.spyOn(BondsSeletorModule, 'selectBondMetrics').mockReturnValue(null);
        jest.spyOn(BondsSeletorModule, 'selectBondInstance').mockReturnValue({ bondOptions: { iconPath: 'http://iconpath' }, isLP: () => false } as any);

        const container = renderComponent(<BondDialog bondID={testBond.bondInstance.ID} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });

        expect(container.container.getElementsByClassName('MuiCircularProgress-root')).toHaveLength(1);
    });
});
