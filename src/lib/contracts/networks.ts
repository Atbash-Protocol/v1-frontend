import { Networks } from "constants/blockchain";

export const getProviderURL = (networkId: number): string => {
    if (![Networks.MAINNET, Networks.RINKEBY, Networks.LOCAL].includes(networkId)) throw new Error(`Unable to get mainNetURI with network "${networkId}"`);

    if (!process.env.REACT_APP_INFURA_ENDPOINT_URL) {
        throw new Error("No provider endpoint url");
    }

    return process.env.REACT_APP_INFURA_ENDPOINT_URL;
};
