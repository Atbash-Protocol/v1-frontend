import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { initWeb3Modal } from 'contexts/web3/web3.utils';

import { USER_REJECTED } from './constants';
import { subscribeProvider, createSigner, resetWeb3Signer } from './subscribers';
import { WEB3ActionTypesEnum, Web3Context, WEB3ContextAction, WEB3State } from './web3.types';

export const initialState: WEB3State = {
    provider: null,
    signer: null,
    signerAddress: null,
    networkID: null,
    web3Modal: initWeb3Modal(),
};

export const PWeb3Context = createContext<Web3Context>({
    state: initialState,
    memoConnect: Promise.reject,
    memoDisconnect: Promise.reject,
});

export const WEB3Reducer = (state: WEB3State, action: WEB3ContextAction) => {
    switch (action.type) {
        case WEB3ActionTypesEnum.CLOSE:
            return { ...state, signer: null, web3Modal: initWeb3Modal() };
        case WEB3ActionTypesEnum.NETWORK_CHANGED:
            return { ...state, networkID: Number(action.payload) };
        case WEB3ActionTypesEnum.SET_SIGNER:
            return { ...state, signer: action.payload.signer, signerAddress: action.payload.address, networkID: action.payload.chainId };
        case WEB3ActionTypesEnum.SET_PROVIDER:
            return { ...state, networkID: action.payload.chainId, provider: action.payload.provider };
        default:
            return state;
    }
};

export const NewWeb3ContextProvider = ({ children }: { children: JSX.Element }) => {
    const {
        state: { web3Modal, signer, provider },
    } = useContext(PWeb3Context);
    const [state, dispatch] = useReducer(WEB3Reducer, initialState);

    const memoConnect = useCallback(async () => {
        if (web3Modal && !signer) {
            await createSigner(web3Modal, dispatch);
        }
    }, [signer, web3Modal]);

    const memoDisconnect = useCallback(
        async (currentSigner: WEB3State['signer']) => {
            if (currentSigner && web3Modal) await resetWeb3Signer(dispatch, web3Modal);
        },
        [web3Modal],
    );

    useEffect(() => {
        // happens when user reload when metamask popup appears
        if (web3Modal) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            web3Modal.on('error', (err: any) => {
                if (err && err?.message && err?.message === USER_REJECTED) alert('User rejected connection');
            });
        }

        // forces the connection
        if (web3Modal && web3Modal.cachedProvider?.length > 0) {
            memoConnect();
        } else {
            if (!provider) {
                subscribeProvider(dispatch); // init at the provider
            }
        }
    }, [web3Modal]);

    // useEffect(() => {
    //     if (!signer && !provider) {
    //         console.log("Reaching this context");
    //         subscribeProvider(dispatch); // init at the provider
    //     }
    // }, [provider, signer]);

    return (
        <PWeb3Context.Provider
            value={{
                state,
                memoConnect,
                memoDisconnect,
            }}
        >
            {children}
        </PWeb3Context.Provider>
    );
};

export const usePWeb3Context = () => {
    return useContext(PWeb3Context);
};
