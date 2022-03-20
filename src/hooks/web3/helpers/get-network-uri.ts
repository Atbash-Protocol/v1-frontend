import { Networks } from "../../../constants/blockchain";
import * as dotenv from "dotenv";

export const getMainnetURI = (): string => {
    return "";
};

export const getLocalnetURI = (): string => {
    return "http://localhost:8545";
};

export const getRinkebyURI = (): string => {
    var infuraID = process.env.REACT_APP_INFURA_API_ID;
    if (!infuraID) throw new Error("REACT_APP_INFURA_API_ID not configured");
    return `https://rinkeby.infura.io/v3/${infuraID}`;
};

export const getNetworkUrl = (networkID: number) => {
    console.log("here", networkID);
    switch (networkID) {
        case Networks.LOCAL:
            return getLocalnetURI();
        case Networks.MAINNET:
            return getMainnetURI();
        case Networks.RINKEBY:
            return getRinkebyURI();
        default:
            throw new Error("Network URL not configured for network ID: " + networkID);
    }
};
