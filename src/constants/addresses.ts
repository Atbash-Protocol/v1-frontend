import { Networks } from "./blockchain";

const LOCAL = {
    DAI_ADDRESS: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // DAI ERC20 fuckit.js:43
    BASH_ADDRESS: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    SBASH_ADDRESS: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    BASH_BONDING_CALC_ADDRESS: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", // todo: bondingCalculator? fuckit.js:60
    TREASURY_ADDRESS: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    STAKING_ADDRESS: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    STAKING_HELPER_ADDRESS: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
    WSBASH_ADDRESS: "0x59b670e9fA9D0A427751Af201D676719a970857b",
    DAO_ADDRESS: "0x000000000000000000000000000000000000dead",
    ZAPIN_ADDRESS: "",
    REDEEM_ADDRESS: "", // SnowbankFinalRedistribution - https://docs.snowbank.finance/events/final-redistribution -
};

const MAINNET = {
    DAO_ADDRESS: "0x31940eE01803476a970ec6DF1094a53F80e6827b",
    SBASH_ADDRESS: "0xB062c51d940bA086e998a113f2975D54f35fFf52",
    WSBASH_ADDRESS: "0x31C4c046EFAD4B04b823a919CC0bDd0f663c87d4",
    BASH_ADDRESS: "0x182b988416Cde1B5D302c8D8162014CAd700FCA7",
    DAI_ADDRESS: "0xB592C2BAd520B1a0E0C7955b74Eb30e817be8D10",
    STAKING_ADDRESS: "0xC12b522cfBf1a8a23C4015f7f491811142828B5F",
    STAKING_HELPER_ADDRESS: "0x494344476c61b13A9664DC40f8cEEd01947FCe40",
    BASH_BONDING_CALC_ADDRESS: "0xA5c7347C251E32FeaEDBD5d60dCd92524073Cc20",
    TREASURY_ADDRESS: "0xF89c4cA8CC3fb50aDdbE6f77E680fCFA87458A88",
    ZAPIN_ADDRESS: "0xb4e6426AE18E7348e54Dd425eC5853cd391d442d",
    REDEEM_ADDRESS: "0xFc3625cD7a5C9D40BfE6EE075A73867B32073f5E",
};

const RINKEBY = {
    DAO_ADDRESS: "0x000000000000000000000000000000000000dead",
    SBASH_ADDRESS: "0xe53B83689538f3ec52FA10C6Fe7C0ff85F681039",
    WSBASH_ADDRESS: "0x63451301eF50aDa69C16C78C455e94d0bcBb1af5",
    BASH_ADDRESS: "0x95627E5C843bc050491132a5E34a64a19471a4CE",
    DAI_ADDRESS: "0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    STAKING_ADDRESS: "0xb9132D6b42492Ba3e291492D9849fFB3Cc1bAB4F",
    STAKING_HELPER_ADDRESS: "0x8876587b075540130A5c69eA3478C13592945439",
    BASH_BONDING_CALC_ADDRESS: "0xa5381A8345edfafc42EB9946C36f5715083a42c9",
    TREASURY_ADDRESS: "0xe3CD62D6A9c5dA97347C8E543e3a0a25be04C8cb",
    ZAPIN_ADDRESS: "",
    REDEEM_ADDRESS: "",
};

export const getAddresses = (networkID: number) => {
    switch (networkID) {
        case Networks.LOCAL:
            return LOCAL;
        case Networks.MAINNET:
            return MAINNET;
        case Networks.RINKEBY:
            return RINKEBY;
        default:
            throw Error("Network don't support");
    }
};
