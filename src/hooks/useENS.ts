import { useEffect, useState } from 'react';

import { utils } from 'ethers';

import { useWeb3Context } from 'contexts/web3/web3.context';

const useENS = () => {
    const [ensName, setENSName] = useState<string | null>(null);

    const {
        state: { provider, signerAddress },
    } = useWeb3Context();

    useEffect(() => {
        const resolveENS = async () => {
            if (signerAddress && provider && utils.isAddress(signerAddress)) {
                const name = await provider.lookupAddress(signerAddress);
                setENSName(name);
            }
        };
        resolveENS();
    }, [provider, signerAddress]);

    return { ensName };
};

export default useENS;
