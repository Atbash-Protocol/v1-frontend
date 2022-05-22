const switchRequest = () => {
    return window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
    });
};

const addChainRequest = () => {
    return window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chaindId: 1,
                chainName: 'Ethereum',
                rpcUrls: ['https://rpc.ankr.com/eth'],
                blockExplorerUrls: ['https://etherscan.io'],
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
            },
        ],
    });
};

export const swithNetwork = async () => {
    if (window.ethereum) {
        try {
            await switchRequest();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            //TODO: Better handling
            if (error.code === 4902) {
                try {
                    await addChainRequest();
                    await switchRequest();
                } catch (addError) {
                    console.error(error);
                }
            }
            console.error(error);
        }
    }
};
