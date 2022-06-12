import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import * as NotistackModule from 'notistack';
import { Provider } from 'react-redux';

import { Web3Context } from 'contexts/web3/web3.context';
import MessageReducer from 'store/modules/messages/messages.slice';
import transactionReducer from 'store/modules/transactions/transactions.slice';

import ViewBase from '.';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <Provider
                store={configureStore({
                    reducer: {
                        messages: MessageReducer,
                        transactions: transactionReducer,
                    },
                    preloadedState: {
                        transactions: [],
                        messages: {
                            notifications: [],
                        },
                    } as any,
                })}
            >
                {component}
            </Provider>
            ,
        </Web3Context.Provider>,
    );
}

describe('ViewBase', () => {
    it('renders', () => {
        jest.spyOn(NotistackModule, 'useSnackbar').mockReturnValue({
            enqueueSnackbar: jest.fn(),
        } as any);
        const Child = () => <> Child </>;

        const comp = renderComponent(
            <ViewBase>
                <Child />
            </ViewBase>,
            {
                state: { signer: null, networkID: null, provider: null },
            },
        );

        expect(comp).toMatchSnapshot();
        expect(comp.queryAllByText('Child')).toBeDefined();
    });
});
