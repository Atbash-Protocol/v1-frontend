import { useEffect, useMemo, useState } from 'react';

import { isNull } from 'lodash';
import { Dispatch } from 'redux';

import { DEFAULT_NETWORK } from 'constants/blockchain';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { walletConnectWarning } from 'store/modules/messages/messages.slice';

export const useGoodNetworkCheck = () => {
    const {
        state: { networkID },
    } = useWeb3Context();

    const [isNetworkOk, setIsNetworkOk] = useState(false);

    useEffect(() => {
        if (networkID) setIsNetworkOk(networkID === DEFAULT_NETWORK);
    }, [networkID]);

    return isNetworkOk;
};

export const useSignerConnected = () => {
    const {
        state: { signer, networkID },
    } = useWeb3Context();

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
    } = useWeb3Context();

    const [isContextInitialized, setIsContextInitialized] = useState(!isNull(provider) || (!isNull(signer) && !isNull(networkID)));

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
    } = useWeb3Context();

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
    } = useWeb3Context();

    return provider;
};

export const useSafeSigner = (dispatch?: Dispatch) => {
    const {
        state: { signer, signerAddress },
    } = useWeb3Context();

    const memoSigner = useMemo(() => {
        if (!signer || !signerAddress) {
            if (dispatch) dispatch(walletConnectWarning);

            throw new Error('Missing signer or signerAddress ');
        }

        return { signer, signerAddress };
    }, [signer, signerAddress]);

    return memoSigner;
};
