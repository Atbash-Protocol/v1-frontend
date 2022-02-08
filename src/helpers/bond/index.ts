import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import BASHUSDCison from "../../assets/tokens/BASH-USDC.png";
import bashUSDTIcon from "../../assets/tokens/BASH-USDT.png";
import MimSdogIcon from "../../assets/tokens/SDOG-MIM.svg";
import avaxUsdceIcon from "../../assets/tokens/AVAX-USDCe.png";
import bashDAIIcon from "../../assets/tokens/BASH-DAI.png";
import BASHFLOOFIcon from "../../assets/tokens/BASH-FLOOF.png";

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const DAIBond = new StableBond({
    name: "DAI",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.RINKEBY]: {
            bondAddress: "0x9eF18088D738A4D3eA8e7C7F539f86AE290ca8a8",
            reserveAddress: "0x6E1cd84718C0Bb113eE69a99dfEe9D7846bB3724",
        },
    },
    isActive: false,
});

export const FraxBond = new StableBond({
    name: "FRAX",
    displayName: "FRAXBOND",
    bondToken: "FRAX",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.RINKEBY]: {
            bondAddress: "0xf2b7E63757f69a01fdc25541A3102751EF2180F3",
            reserveAddress: "0xb4e6426AE18E7348e54Dd425eC5853cd391d442d",
        },
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
        [Networks.AVAX]: {
            bondAddress: "0x9eF18088D738A4D3eA8e7C7F539f86AE290ca8a8", // dai bond hardcoded here
            reserveAddress: "0x90B48A4451Cb1f7Feb85C59B0c8E04d736F2b60f", //bash usdc
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0x7d1232b90d3f809a54eeaeebc639c62df8a8942f",
    isActive: true,
});

export default [DAIBond, FraxBond, BASHUSDC];
