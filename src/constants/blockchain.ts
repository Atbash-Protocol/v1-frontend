export const TOKEN_DECIMALS = 9;

export enum Networks {
    MAINNET = 1,
    RINKEBY = 4,
    LOCAL = 1337,
}

function getDefaultNetwork(): Networks {
    console.log(`Network ID: ${process.env.REACT_APP_DEFAULT_NETWORK_ID}`);
    return parseInt(process.env.REACT_APP_DEFAULT_NETWORK_ID);
}

export const DEFAULT_NETWORK = getDefaultNetwork();
