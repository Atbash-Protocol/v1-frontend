import { render } from '@testing-library/react';
import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { Provider } from 'react-redux';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import * as BondSelectorModule from 'store/modules/bonds/bonds.selector';
import * as MarketSelectorModule from 'store/modules/markets/markets.selectors';

import BondList from './BondList';

describe('BondList', () => {
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
                contracts: {},
            },
            markets: {
                markets: {
                    dai: 'dai',
                },
            },
            account: {
                balances: {
                    BASH: ethers.BigNumber.from('0x2'),
                },
            },
            transactions: [],
        };

        jest.spyOn(BondSelectorModule, 'selectAllBonds').mockReturnValue({
            activeBonds: [],
            inactiveBonds: [],
        });

        jest.spyOn(BondSelectorModule, 'selectFormattedTreasuryBalance').mockReturnValue('$25.00');
        jest.spyOn(BondSelectorModule, 'selectBondsReady').mockReturnValue(true);
        jest.spyOn(MarketSelectorModule, 'selectFormattedBashBalance').mockReturnValue('$10.00');
        store = mockStore(state);
        const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 1 } };

        render(<BondList />, {
            wrapper: ({ children }) => (
                <Web3Context.Provider value={providerValue as any}>
                    <Provider store={store}>{children}</Provider>
                </Web3Context.Provider>
            ),
        });
    });

    it('renders', () => {
        expect(store.getActions()).toHaveLength(2);
    });
});
