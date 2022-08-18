export const TOKEN_DECIMALS = 9;

export enum Networks {
    MAINNET = 1,
    RINKEBY = 4,
    LOCAL = 1337,
}

function getDefaultNetwork(): Networks {
    const networkId: string | undefined = process.env.REACT_APP_DEFAULT_NETWORK_ID;
    console.log(`Network: ${networkId}`);
    if (!networkId) throw new Error('Network ID not defined');
    return parseInt(networkId);
}

export const DEFAULT_NETWORK = getDefaultNetwork();
