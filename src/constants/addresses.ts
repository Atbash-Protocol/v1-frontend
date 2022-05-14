import { Networks } from "./blockchain";

export { address as BashAddress } from "../deployments/localhost/BASHERC20Token.json";
export { address as DaiAddress } from "../deployments/localhost/DAI.json";
export { address as SBashAddress } from "../deployments/localhost/sBASH.json";
export { address as WSBashAddress } from "../deployments/localhost/wsBASH.json";
export { address as BashDaiBondingCalculatorAddress } from "../deployments/localhost/bashDaiBondingCalculator.json";
export { address as TreasuryAddress } from "../deployments/localhost/BashTreasury.json";
export { address as StakingAddress } from "../deployments/localhost/ATBASHStaking.json";
export { address as StakingHelperAddress } from "../deployments/localhost/StakingHelper.json";
export { address as PresaleAddress } from "../deployments/localhost/Presale.json";
export { address as DaiBondAddress } from "../deployments/localhost/atbashBondDepository.json";
export { address as BashDaiBondAddress } from "../deployments/localhost/bashDaiBondDepository.json";
export { address as BashDaiLpAddress } from "../deployments/localhost/BashDaiUniswapPairV2.json";

import {
    BashAddress,
    DaiAddress,
    SBashAddress,
    WSBashAddress,
    BashDaiBondingCalculatorAddress,
    TreasuryAddress,
    StakingAddress,
    StakingHelperAddress,
    PresaleAddress,
} from "./addresses";

const LOCAL = {
    DAI_ADDRESS: DaiAddress, // "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    BASH_ADDRESS: BashAddress, // "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SBASH_ADDRESS: SBashAddress, // "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    WSBASH_ADDRESS: WSBashAddress, // "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    BASH_BONDING_CALC_ADDRESS: BashDaiBondingCalculatorAddress, // "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0", // todo: bondingCalculator? fuckit.js:60
    TREASURY_ADDRESS: TreasuryAddress, // "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    STAKING_ADDRESS: StakingAddress, // "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    STAKING_HELPER_ADDRESS: StakingHelperAddress, // "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    DAO_ADDRESS: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // "0x000000000000000000000000000000000000dead",
    ATBASH_PRESALE_ADDRESS: PresaleAddress, // "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
    DAO_ADDRESS: "0x02c368c0787BB33ACAc698049CcA2454B5cC96c5",
    SBASH_ADDRESS: "0xe53B83689538f3ec52FA10C6Fe7C0ff85F681039",
    WSBASH_ADDRESS: "0x63451301eF50aDa69C16C78C455e94d0bcBb1af5",
    BASH_ADDRESS: "0x95627E5C843bc050491132a5E34a64a19471a4CE",
    DAI_ADDRESS: "0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    STAKING_ADDRESS: "0xb9132D6b42492Ba3e291492D9849fFB3Cc1bAB4F",
    STAKING_HELPER_ADDRESS: "0x8876587b075540130A5c69eA3478C13592945439",
    BASH_BONDING_CALC_ADDRESS: "0x27aFDfE2440Bb80c1E6C6A0f862F42b480FF2024", // daibondCalc: "0xa5381A8345edfafc42EB9946C36f5715083a42c9",
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
