import MimIcon from 'assets/tokens/BASH-DAI.png';
import DAIIcon from 'assets/tokens/DAI.e.png';
import { Networks } from 'constants/blockchain';
import { BondType } from 'helpers/bond/constants';
import { BondConfig, BondProviderEnum } from 'lib/bonds/bonds.types';

import { ActiveTokensEnum } from './tokens';

const BASH_DAI: BondConfig = {
    name: 'bash_dai_lp',
    displayName: 'BASH-DAI LP',
    token: ActiveTokensEnum.DAI,
    iconPath: MimIcon,
    lpProvider: BondProviderEnum.UNISWAP_V2, // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
    type: BondType.LP,
    addresses: {
        [Networks.MAINNET]: {
            bondAddress: '',
            reserveAddress: '',
        },
        [Networks.LOCAL]: {
            bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
            reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016',
        },
        [Networks.RINKEBY]: {
            bondAddress: '0xfabd3f8772474250863C7f0c642Fd1c7704B1caa',
            reserveAddress: '0xC55C0aD007edaEB867e77d2906C682D99B2C3c23', // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
        },
    },
    isActive: true,
};

const StableDAI: BondConfig = {
    name: 'DAI',
    displayName: 'DAI',
    token: ActiveTokensEnum.DAI,
    iconPath: DAIIcon,
    lpProvider: BondProviderEnum.UNISWAP_V2, // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
    type: BondType.STABLE_ASSET,
    addresses: {
        [Networks.RINKEBY]: {
            bondAddress: '0xE6bD71E3acB44814bfED063c75057748bfA94D14',
            reserveAddress: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735', // DAI
        },
        [Networks.RINKEBY]: {
            bondAddress: '0xE6bD71E3acB44814bfED063c75057748bfA94D14',
            reserveAddress: '0xC55C0aD007edaEB867e77d2906C682D99B2C3c23', // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
        },
        [Networks.LOCAL]: {
            bondAddress: '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
            reserveAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', // DAI
        },
        [Networks.MAINNET]: {
            bondAddress: '',
            reserveAddress: '',
        },
    },
    isActive: true,
};

export const BONDS = [BASH_DAI, StableDAI];
