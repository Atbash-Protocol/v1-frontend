import { Networks } from "constants/blockchain";

export const getMainnetURI = (networkId: number): string => {
    if (networkId === Networks.MAINNET) {
        return process.env.INFURA_ENDPOINT_URL;
    }

    if (networkId === Networks.RINKEBY) {
        return process.env.INFURA_ENDPOINT_URL;
    }

    if (networkId === Networks.LOCAL) {
        return "http://localhost:8545";
    }

    throw new Error(`Unable to get mainNetURI with network "${networkId}"`);
};
