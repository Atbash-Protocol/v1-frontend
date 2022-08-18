import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getNetworkURI } from './web3/helpers/get-network-uri';
import { DEFAULT_NETWORK } from '../constants';

const useENS = (address: string) => {
    const [ensName, setENSName] = useState<string | null>(null);

    useEffect(() => {
        const resolveENS = async () => {
            if (ethers.utils.isAddress(address)) {
                const provider = new ethers.providers.JsonRpcProvider(getNetworkURI(DEFAULT_NETWORK));
                try {
                    const ensName = await provider.lookupAddress(address);
                    setENSName(ensName);
                } catch (e) {
                    console.info('ENS not found');
                }
            }
        };
        resolveENS();
    }, [address]);

    return { ensName };
};

export default useENS;
