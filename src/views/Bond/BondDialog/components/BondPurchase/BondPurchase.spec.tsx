import { fireEvent, render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import { Provider } from 'react-redux';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';

import BondPurchase from './index';

describe('#BondPurchase', () => {
    const middlewares = [thunk];
    const mockStore = createMockStore(middlewares);
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

    let store: MockStoreEnhanced<unknown, any>;

    beforeEach(() => {
        const state = {
            bonds: {
                loading: false,
                bondQuote: {
                    interestDue: null,
                    bondMaturationBlock: null,
                    pendingPayout: null,
                },
                bondInstances: {
                    dai: new LPBond(bondOptions),
                },
                bondMetrics: {
                    dai: {
                        allowance: 0,
                    },
                },
            },
            main: {
                blockchain: {
                    timestamp: DateTime.utc().toMillis(),
                },
            },
            transactions: [],
        };
        store = mockStore(state);
        const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

        render(<BondPurchase bondID={'dai'} />, {
            wrapper: ({ children }) => (
                <Web3Context.Provider value={providerValue as any}>
                    <Provider store={store}>{children}</Provider>
                </Web3Context.Provider>
            ),
        });
    });

    it('approves the bond', () => {
        fireEvent.click(screen.getByText(/bond:ZapinApproveToken/i));
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual(expect.objectContaining({ type: 'bonds/approve/pending' }));
    });
});
