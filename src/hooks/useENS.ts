import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { PWeb3Context } from "contexts/web3/web3.context";

const useENS = () => {
    const [ensName, setENSName] = useState<string | null>(null);

    const {
        state: { provider, signerAddress },
    } = useContext(PWeb3Context);

    useEffect(() => {
        const resolveENS = async () => {
            if (signerAddress && provider && ethers.utils.isAddress(signerAddress)) {
                try {
                    const ensName = await provider.lookupAddress(signerAddress);
                    setENSName(ensName);
                } catch (e) {
                    console.info("ENS not found");
                }
            }
        };
        resolveENS();
    }, [provider, signerAddress]);

    return { ensName };
};

export default useENS;
