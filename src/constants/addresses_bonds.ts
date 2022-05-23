import { Networks } from './blockchain';

export const BASH_DAI_BOND = {
    [Networks.MAINNET]: {
        bondAddress: '',
        reserveAddress: '',
    },
    [Networks.LOCAL]: {
        bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
        reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016',
    },
    [Networks.RINKEBY]: {
        bondAddress: '0xcE24D6A45D5c59D31D05c8C278cA3455dD6a43DA',
        reserveAddress: '0x26DF06b47412dA76061ddA1fD9fe688A497FB88b', // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
    },
};
