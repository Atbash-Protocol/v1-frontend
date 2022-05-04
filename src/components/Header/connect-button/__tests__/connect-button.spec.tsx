import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Web3Context } from 'contexts/web3/web3.context';
import * as WEB3HookModules from 'contexts/web3/web3.hooks';
import pendingTransactionsReducer from 'store/slices/pending-txns-slice';

import ConnectMenu from '../index';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <Provider
                store={configureStore({
                    reducer: {
                        pendingTransactions: pendingTransactionsReducer,
                    },
                })}
            >
                {component}
            </Provider>
            ,
        </Web3Context.Provider>,
    );
}

describe('ConnectMenu', () => {
    describe('when user is disconnected', () => {
        it('triggers a connect on click if disconnected', () => {
            const memoConnect = jest.fn();
            const { container } = renderComponent(<ConnectMenu />, {
                state: {
                    provider: null,
                    signer: null,
                },
                memoConnect,
                memoDisconnect: jest.fn(),
            });

            const connectButton = container.querySelector('button');
            expect(container.querySelector('button')?.textContent).toEqual('ConnectWallet');

            connectButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(memoConnect).toHaveBeenCalledTimes(1);

            expect(container).toMatchSnapshot()
        });
    });

    describe('when user is connected', () => {
        it('shows indicates a wrong network', () => {
            jest.spyOn(WEB3HookModules, 'useGoodNetworkCheck').mockReturnValue(false);
            const { container } = renderComponent(<ConnectMenu />, {
                state: {
                    provider: null,
                    signer: 'signer',
                    signerAddress: 'signerAddress',
                },
            });

            expect(container.querySelector('button')?.textContent).toEqual('WrongNetwork');
        });

        it('triggers a connect on click if disconnected', () => {
            const memoDisconnect = jest.fn();
            jest.spyOn(WEB3HookModules, 'useGoodNetworkCheck').mockReturnValue(true);

            const { container } = renderComponent(<ConnectMenu />, {
                state: {
                    provider: null,
                    signer: 'signer',
                    signerAddress: 'signerAddress',
                },
                memoDisconnect,
            });

            const connectButton = container.querySelector('button');
            expect(container.querySelector('button')?.textContent).toEqual('Disconnect');

            connectButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(memoDisconnect).toHaveBeenCalledTimes(1);
        });
    });
});
