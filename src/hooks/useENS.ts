import { useContext, useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { Web3Context } from 'contexts/web3/web3.context';

const useENS = () => {
    const [ensName, setENSName] = useState<string | null>(null);

    const {
        state: { provider, signerAddress },
    } = useContext(Web3Context);

    useEffect(() => {
        const resolveENS = async () => {
            if (signerAddress && provider && ethers.utils.isAddress(signerAddress)) {
                const name = await provider.lookupAddress(signerAddress);
                setENSName(name);
            }
        };
        resolveENS();
    }, [provider, signerAddress]);

    return { ensName };
};

export default useENS;
