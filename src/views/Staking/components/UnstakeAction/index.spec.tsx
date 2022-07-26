import { screen, render, fireEvent } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';

import { UnStakeCard } from '.';

const renderComponent = (state?: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    const component = render(
        <Web3Context.Provider value={providerValue as any}>
            <Provider store={store}>
                <UnStakeCard />
            </Provider>
        </Web3Context.Provider>,
    );

    return {
        component,
        store,
    };
};

describe('StakeCard', () => {
    it('dispatches a staking action on formClick', () => {
        const state = {
            account: {
                balances: {
                    BASH: BigNumber.from(120),
                    SBASH: BigNumber.from(10),
                },
                stakingAllowance: {
                    BASH: BigNumber.from(100000),
                    SBASH: BigNumber.from(100000),
                },
            },
            transactions: [],
        };
        const { component, store } = renderComponent(state);

        const btns = component.container.querySelectorAll('.MuiButton-root');

        expect(btns).toHaveLength(1);

        fireEvent.click(btns[0]);

        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual(expect.objectContaining({ type: 'staking/staking/pending' }));
    });

    it('dispatches an approve action on formClick', () => {
        const state = {
            account: {
                balances: {
                    BASH: BigNumber.from(120),
                    SBASH: BigNumber.from(10),
                },
                stakingAllowance: {
                    BASH: BigNumber.from(0),
                    SBASH: BigNumber.from(0),
                },
            },
            transactions: [],
        };
        const { component, store } = renderComponent(state);

        const btns = component.container.querySelectorAll('.MuiButton-root');

        expect(btns).toHaveLength(1);

        fireEvent.click(btns[0]);

        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual(expect.objectContaining({ type: 'staking/approve/pending' }));
    });
});
