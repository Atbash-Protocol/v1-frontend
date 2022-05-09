import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

import { Networks } from 'constants/blockchain';
import { theme } from 'constants/theme';
import { getProviderURL } from 'lib/contracts/networks';

export const initWeb3Modal = () =>
    new Web3Modal({
        network: '0x1',
        cacheProvider: true,
        theme: {
            background: theme.palette.cardBackground.main,
            main: theme.palette.primary.light,
            secondary: theme.palette.primary.light,
            hover: theme.palette.grey[800],
            border: 'none',
        },

        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        [Networks.LOCAL]: getProviderURL(Networks.LOCAL),
                        [Networks.RINKEBY]: getProviderURL(Networks.RINKEBY),
                        [Networks.MAINNET]: getProviderURL(Networks.MAINNET),
                    },
                },
            },
        },
    });

export const getProviderURI = (networkId: number): string => {
    if (![Networks.MAINNET, Networks.RINKEBY, Networks.LOCAL].includes(networkId)) throw new Error(`Unable to get mainNetURI with network "${networkId}"`);

    const rpcUrl: string | undefined = process.env.REACT_APP_NETWORK_RPC_URL;
    if (!rpcUrl) throw new Error('Network RPC URL not defined');

    return rpcUrl;
};
