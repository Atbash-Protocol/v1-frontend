import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Networks } from "constants/blockchain";
import { utils } from "ethers";

export const getProviderURL = (networkId: number): string => {
    if (![Networks.MAINNET, Networks.RINKEBY, Networks.LOCAL].includes(networkId)) throw new Error(`Unable to get mainNetURI with network "${networkId}"`);

    if (!process.env.REACT_APP_INFURA_ENDPOINT_URL) {
        throw new Error("No provider endpoint url");
    }

    return process.env.REACT_APP_INFURA_ENDPOINT_URL;
};

export const getGasPrice = async (provider: JsonRpcProvider) => {
    const gasPrice = await provider.getGasPrice();

    return utils.formatUnits(gasPrice, "gwei");
};

export const getSigner = async (provider: JsonRpcProvider | Web3Provider) => {
    const { url } = provider.connection;

    if (["metamask"].includes(url)) return provider.getSigner();

    return provider;
};
