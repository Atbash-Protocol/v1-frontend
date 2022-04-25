import { useContext, useState, useLayoutEffect } from 'react';

import Loader from 'components/Loader';
import { PWeb3Context } from 'contexts/web3/web3.context';

export const useAppReady = () => {
    const {
        state: { signer, networkID, provider },
    } = useContext(PWeb3Context);

    const [isContextInitialized, setIsContextInitialized] = useState([provider, signer, networkID].some(e => e !== null));

    useLayoutEffect(() => {
        if (provider || signer) {
            setIsContextInitialized(true);
        }
    }, [provider, signer]);

    if (!isContextInitialized) return <Loader />;

    return isContextInitialized;
};
