import Loader from "components/Loader";
import { DEFAULT_NETWORK, getDefaultNetwork } from "constants/blockchain";
import { PWeb3Context } from "contexts/web3/web3.context";
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

export const useGoodNetworkCheck = () => {
    const {
        state: { networkID },
    } = useContext(PWeb3Context);

    const [isNetworkOk, setIsNetworkOk] = useState(false);

    useEffect(() => {
        if (networkID) setIsNetworkOk(networkID === DEFAULT_NETWORK);
    }, [networkID]);

    return isNetworkOk;
};

export const useSignerConnected = () => {
    const {
        state: { signer, networkID },
    } = useContext(PWeb3Context);

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
    } = useContext(PWeb3Context);

    const [isContextInitialized, setIsContextInitialized] = useState([provider, signer, networkID].some(e => e !== null));

    useLayoutEffect(() => {
        if (provider || signer) {
            setIsContextInitialized(true);
        }
    }, [provider, signer]);

    return isContextInitialized;
};

export const useSignerAddress = () => {
    const {
        state: { signer: s2, signerAddress },
    } = useContext(PWeb3Context);

    const [signer, setSigner] = useState(signerAddress);

    useEffect(() => {
        if (signerAddress) {
            setSigner(signerAddress);
        }
    }, [signerAddress]);

    return signer;
};

export const useRpcProvider = () => {
    const {
        state: { provider },
    } = useContext(PWeb3Context);

    return provider;
};
