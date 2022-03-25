import { Networks } from "constants/blockchain";

export const getNetworkURI = (networkId: number): string => {
    if (![Networks.MAINNET, Networks.RINKEBY, Networks.LOCAL].includes(networkId)) throw new Error(`Unable to get mainNetURI with network "${networkId}"`);
    return process.env.REACT_APP_NETWORK_RPC_URL;
};
