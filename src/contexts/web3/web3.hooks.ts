import { useContext, useEffect, useMemo, useState } from 'react';

import { Dispatch } from 'redux';

import { DEFAULT_NETWORK } from 'constants/blockchain';
import { Web3Context } from 'contexts/web3/web3.context';
import { walletConnectWarning } from 'store/modules/messages/messages.slice';

export const useGoodNetworkCheck = () => {
    const {
        state: { networkID },
    } = useContext(Web3Context);

    const [isNetworkOk, setIsNetworkOk] = useState(false);

    useEffect(() => {
        if (networkID) setIsNetworkOk(networkID === DEFAULT_NETWORK);
    }, [networkID]);

    return isNetworkOk;
};

export const useSignerConnected = () => {
    const {
        state: { signer, networkID },
    } = useContext(Web3Context);

    const [isConnected, setIsConnected] = useState(signer !== null);

    useEffect(() => {
        if (signer && networkID) {
            setIsConnected(true);
        }
    }, [isConnected, signer, networkID]);

    return isConnected;
};

export const useWeb3ContextInitialized = () => {
    const {
        state: { signer, networkID, provider },
    } = useContext(Web3Context);

    const [isContextInitialized, setIsContextInitialized] = useState([provider, signer, networkID].some(e => e !== null));

    useEffect(() => {
        if (provider || signer) {
            setIsContextInitialized(true);
        }
    }, [provider, signer]);

    return isContextInitialized;
};

export const useSignerAddress = () => {
    const {
        state: { signerAddress },
    } = useContext(Web3Context);

    const [signer, setSigner] = useState(signerAddress);

    useEffect(() => {
        if (signerAddress) {
            setSigner(signerAddress);
        }
    }, [signerAddress]);

    return signer;
};

export const useProvider = () => {
    const {
        state: { provider },
    } = useContext(Web3Context);

    return provider;
};

export const useSafeSigner = (dispatch?: Dispatch) => {
    const {
        state: { signer, signerAddress },
    } = useContext(Web3Context);

    const memoSigner = useMemo(() => {
        if (!signer || !signerAddress) {
            if (dispatch) dispatch(walletConnectWarning);

            throw new Error('Missing signer or signerAddress ');
        }

        return { signer, signerAddress };
    }, [signer, signerAddress]);

    return memoSigner;
};
