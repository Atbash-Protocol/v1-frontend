import { Networks } from "constants/blockchain";
import { BondType } from "helpers/bond/constants";
import { BondConfig, BondProviderEnum } from "lib/bonds/bonds.types";
import { ActiveTokensEnum } from "./tokens";

import MimIcon from "assets/tokens/BASH-DAI.png";
import DAIIcon from "assets/tokens/DAI.e.png";

const BASH_DAI: BondConfig = {
    name: "bash_dai_lp",
    displayName: "BASH-DAI LP",
    token: ActiveTokensEnum.DAI,
    iconPath: MimIcon,
    lpProvider: BondProviderEnum.UNISWAP_V2, // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    type: BondType.LP,
    addresses: {
        [Networks.MAINNET]: {
            bondAddress: "",
            reserveAddress: "",
        },
        [Networks.LOCAL]: {
            bondAddress: "0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650",
            reserveAddress: "0x908B40ED87FCA620B101B3Cba2B4C640D11eF016",
        },
        [Networks.RINKEBY]: {
            bondAddress: "0xcE24D6A45D5c59D31D05c8C278cA3455dD6a43DA",
            reserveAddress: "0x26DF06b47412dA76061ddA1fD9fe688A497FB88b", // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
        },
    },
    isActive: false,
};

const StableDAI: BondConfig = {
    name: "DAI",
    displayName: "DAI",
    token: ActiveTokensEnum.DAI,
    iconPath: DAIIcon,
    lpProvider: BondProviderEnum.UNISWAP_V2, // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    type: BondType.StableAsset,
    addresses: {
        [Networks.RINKEBY]: {
            bondAddress: "0xd0D5024c723c4F047C7626FBA18E7797A4E50a12",
            reserveAddress: "0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB", // DAI
        },
        [Networks.LOCAL]: {
            bondAddress: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1",
            reserveAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // DAI
        },
        [Networks.MAINNET]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    isActive: true,
};

export const BONDS = [BASH_DAI, StableDAI];
