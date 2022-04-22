import { ExternalProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { DEFAULT_NETWORK } from "constants/blockchain";
import { ethers } from "ethers";
import { getProviderURI, initWeb3Modal } from "lib/web3/web3.utils";
import { createContext, Dispatch, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { USER_REJECTED } from "./constants";
import { subscribeSigner, subscribeProvider } from "./subscribers";
import { WEB3ActionTypesEnum, Web3Context, WEB3ContextAction, WEB3State } from "./web3.types";

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
    console.debug(action, state, { ...state, networkID: action.payload });
    switch (action.type) {
        case WEB3ActionTypesEnum.CLOSE:
            return { ...state, signer: null };
        case WEB3ActionTypesEnum.NETWORK_CHANGED:
            return { ...state, networkID: Number(action.payload) };
        case WEB3ActionTypesEnum.SET_SIGNER:
            return { ...state, signer: action.payload.signer, signerAddress: action.payload.address, networkID: action.payload.chainId };
        case WEB3ActionTypesEnum.SET_PROVIDER:
            return { ...state, netWorkID: action.payload.chainId, provider: action.payload.provider };
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
            const web3Provider = await web3Modal.connect();

            await subscribeSigner(web3Provider, dispatch);
        }
    }, [signer, web3Modal]);

    const memoDisconnect = useCallback(() => {
        if (signer && web3Modal) dispatch({ type: WEB3ActionTypesEnum.CLOSE, payload: null });
    }, [web3Modal, signer]);

    useEffect(() => {
        if (!signer && !provider) subscribeProvider(dispatch);
    }, [provider, signer]);

    useEffect(() => {
        // overrides the redux web3 error handling
        if (web3Modal) {
            web3Modal.on("error", (err: any) => {
                if (err && err?.message && err?.message === USER_REJECTED) {
                    alert("User rejected connection");
                }
            });
        }

        // forces the connection
        if (web3Modal && web3Modal.cachedProvider?.length > 0) {
            memoConnect();
        }
    }, [web3Modal]);

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

export const usePWeb3Context = () => {};
