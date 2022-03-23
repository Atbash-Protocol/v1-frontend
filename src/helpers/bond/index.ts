import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import ETHIcon from "../../assets/tokens/ETH.svg";
import AvaxIcon from "../../assets/tokens/floof.png";
import BASHUSDCison from "../../assets/tokens/BASH-USDC.png";
import bashUSDTIcon from "../../assets/tokens/BASH-USDT.png";
import DAIIcon from "../../assets/tokens/DAI.e.png";
import MimSdogIcon from "../../assets/tokens/SDOG-MIM.svg";
import avaxUsdceIcon from "../../assets/tokens/AVAX-USDCe.png";
import bashDAIIcon from "../../assets/tokens/BASH-DAI.png";
import BASHFLOOFIcon from "../../assets/tokens/BASH-FLOOF.png";

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "DAI",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: DAIIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.RINKEBY]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // DAI
        },
        [Networks.MAINNET]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    isActive: false,
});

export const wavax = new CustomBond({
    name: "FLOOF",
    displayName: "FLOOF",
    bondToken: "ETH",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.MAINNET]: {
            bondAddress: "0x472c18c4079eCb68629F4FbA1141172404BFEE9C",
            reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.RINKEBY]: { bondAddress: "", reserveAddress: "" },
    },
    isActive: false,
});

export const BASHUSDC = new LPBond({
    name: "bash_usdc_lp",
    displayName: "BASH-USDC LP",
    bondToken: "USDC",
    bondIconSvg: BASHUSDCison,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.MAINNET]: {
            bondAddress: "0x90A08fdF9f433954930f19E97FE9A1B0bDBf5C5f",
            reserveAddress: "0x425c45adfb53861e5db8f17d9b072ab60d4404d8",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.RINKEBY]: { bondAddress: "", reserveAddress: "" },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0x7d1232b90d3f809a54eeaeebc639c62df8a8942f",
    isActive: false,
});

export const BASHDAI = new LPBond({
    name: "bash_dai_lp",
    displayName: "BASH-DAI LP",
    bondToken: "DAI",
    bondIconSvg: bashDAIIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.MAINNET]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "0x26DF06b47412dA76061ddA1fD9fe688A497FB88b",
        },
        [Networks.RINKEBY]: {
            bondAddress: "",
            reserveAddress: "0x26DF06b47412dA76061ddA1fD9fe688A497FB88b", // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
        },
    },
    lpUrl: "https://app.uniswap.org/#/add/v2/0x95627E5C843bc050491132a5E34a64a19471a4CE/0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB?chain=rinkeby", // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    isActive: false,
});

// export const avaxUsdce = new CustomLPBond({
//     name: "usdce_avax_lp",
//     displayName: "USDC.e-AVAX LP",
//     bondToken: "AVAX",
//     bondIconSvg: avaxUsdceIcon,
//     bondContractABI: LpBondContract,
//     reserveContractAbi: LpReserveContract,
//     networkAddrs: {
//         [Networks.AVAX]: {
//             bondAddress: "0x5E831EF7B5B2824B6F327055d0193Ecf8dCAA480",
//             reserveAddress: "0xa389f9430876455c36478deea9769b7ca4e3ddb1",
//         },
//     },
//     lpUrl: "https://www.traderjoexyz.com/#/pool/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
//     isActive: true,
// });

export const bashDai = new StableBond({
    name: "bash_dai_minting",
    displayName: "BASH-DAI LP",
    bondToken: "DAI",
    bondIconSvg: bashDAIIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.RINKEBY]: {
            bondAddress: "0x90A08fdF9f433954930f19E97FE9A1B0bDBf5C5f",
            reserveAddress: "0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.MAINNET]: { bondAddress: "", reserveAddress: "" },
    },
    isActive: true,
});

export const bashFloof = new LPBond({
    name: "bash_floof_minting",
    displayName: "BASH-FLOOF LP",
    bondToken: "FLOOF",
    bondIconSvg: BASHFLOOFIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.MAINNET]: {
            bondAddress: "0x90A08fdF9f433954930f19E97FE9A1B0bDBf5C5f",
            reserveAddress: "0x781655d802670bba3c89aebaaea59d3182fd755d",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.RINKEBY]: { bondAddress: "", reserveAddress: "" },
    },
    lpUrl: "https://traderjoexyz.com/#/pool/AVAX/0x130966628846bfd36ff31a822705796e8cb8c18d",
    isActive: false,
});

// export const mimSdog = new LPBond({
//     name: "mim_sdog_lp",
//     displayName: "SDOG-MIM LP",
//     bondToken: "MIM",
//     bondIconSvg: MimSdogIcon,
//     bondContractABI: LpBondContract,
//     reserveContractAbi: LpReserveContract,
//     networkAddrs: {
//         [Networks.AVAX]: {
//             bondAddress: "0x0d71d9616f6844f12f1ce1516aa67817754517ff",
//             reserveAddress: "0xa3f1f5076499ec37d5bb095551f85ab5a344bb58",
//         },
//     },
//     lpUrl: "https://traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xdE9E52F1838951e4d2bb6C59723B003c353979b6",
// });

export const bashUSDT = new CustomLPBond({
    name: "bash_USDT_lp",
    displayName: "BASH-USDT LP",
    bondToken: "USDT",
    bondIconSvg: bashUSDTIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.MAINNET]: {
            bondAddress: "0x90A08fdF9f433954930f19E97FE9A1B0bDBf5C5f",
            reserveAddress: "0xa3d2cfe49df9d1ea0dc589b69252e1eddc417d6d",
        },
        [Networks.LOCAL]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.RINKEBY]: { bondAddress: "", reserveAddress: "" },
    },
    lpUrl: "https://traderjoexyz.com/#/pool/AVAX/0x7d1232b90d3f809a54eeaeebc639c62df8a8942f",
    isActive: false,
});

// export default [dai, wavax, BASHUSDC, bashUSDT, bashDai];
export default [dai];
