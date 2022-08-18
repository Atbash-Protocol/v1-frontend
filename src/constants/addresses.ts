import { Networks } from './blockchain';

export { address as BashAddress } from '../deployments/localhost/BASHERC20Token.json';
export { address as DaiAddress } from '../deployments/localhost/DAI.json';
export { address as SBashAddress } from '../deployments/localhost/sBASH.json';
export { address as WSBashAddress } from '../deployments/localhost/wsBASH.json';
export { address as BondingCalculatorAddress } from '../deployments/localhost/ATBASHBondingCalculator.json';
export { address as TreasuryAddress } from '../deployments/localhost/BashTreasury.json';
export { address as StakingAddress } from '../deployments/localhost/ATBASHStaking.json';
export { address as StakingHelperAddress } from '../deployments/localhost/StakingHelper.json';
export { address as PresaleAddress } from '../deployments/localhost/Presale.json';
export { address as DaiBondAddress } from '../deployments/localhost/atbashBondDepository.json';
export { address as BashDaiBondAddress } from '../deployments/localhost/bashDaiBondDepository.json';
export { address as BashDaiLpAddress } from '../deployments/localhost/BashDaiUniswapPairV2.json';

import { BashAddress, DaiAddress, SBashAddress, WSBashAddress, BondingCalculatorAddress, TreasuryAddress, StakingAddress, StakingHelperAddress, PresaleAddress } from './addresses';
import { readFile } from 'fs/promises';

const LOCAL = {
    DAI_ADDRESS: DaiAddress, // "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    BASH_ADDRESS: BashAddress, // "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SBASH_ADDRESS: SBashAddress, // "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    WSBASH_ADDRESS: WSBashAddress, // "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    BASH_BONDING_CALC_ADDRESS: BondingCalculatorAddress, // "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0", // todo: bondingCalculator? fuckit.js:60
    TREASURY_ADDRESS: TreasuryAddress, // "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    STAKING_ADDRESS: StakingAddress, // "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    STAKING_HELPER_ADDRESS: StakingHelperAddress, // "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    DAO_ADDRESS: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // "0x000000000000000000000000000000000000dead",
    ATBASH_PRESALE_ADDRESS: PresaleAddress, // "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ZAPIN_ADDRESS: '',
    REDEEM_ADDRESS: '', // SnowbankFinalRedistribution - https://docs.snowbank.finance/events/final-redistribution -
};

const MAINNET = {
    DAO_ADDRESS: '0x31940eE01803476a970ec6DF1094a53F80e6827b',
    SBASH_ADDRESS: '0xB062c51d940bA086e998a113f2975D54f35fFf52',
    WSBASH_ADDRESS: '0x31C4c046EFAD4B04b823a919CC0bDd0f663c87d4',
    BASH_ADDRESS: '0x182b988416Cde1B5D302c8D8162014CAd700FCA7',
    DAI_ADDRESS: '0xB592C2BAd520B1a0E0C7955b74Eb30e817be8D10',
    STAKING_ADDRESS: '0xC12b522cfBf1a8a23C4015f7f491811142828B5F',
    STAKING_HELPER_ADDRESS: '0x494344476c61b13A9664DC40f8cEEd01947FCe40',
    BASH_BONDING_CALC_ADDRESS: '0xA5c7347C251E32FeaEDBD5d60dCd92524073Cc20',
    TREASURY_ADDRESS: '0xF89c4cA8CC3fb50aDdbE6f77E680fCFA87458A88',
    ZAPIN_ADDRESS: '0xb4e6426AE18E7348e54Dd425eC5853cd391d442d',
    REDEEM_ADDRESS: '0xFc3625cD7a5C9D40BfE6EE075A73867B32073f5E',
};

const RINKEBY = {
    DAO_ADDRESS: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    SBASH_ADDRESS: '0xF0868F5C6F5f506C26f003caA500c080A5A4823C',
    WSBASH_ADDRESS: '0x27fa0a8D066BA0C627ADfdB76721a71De1CFe6d4',
    BASH_ADDRESS: '0xb9c20Db8649D5d9D0649031a52C39fa2bD6c4e97',
    DAI_ADDRESS: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    STAKING_ADDRESS: '0xd57740693a36c14900dcaeF26d8f97035E9D8e61',
    STAKING_HELPER_ADDRESS: '0x7Dd384C4EEBf3bea3AD796AFbf6971ee8217f568',
    BASH_BONDING_CALC_ADDRESS: '0xAdb7030AC6E7716Fd2ccDF9f64A446945508f049', // daibondCalc: "0xa5381A8345edfafc42EB9946C36f5715083a42c9",
    TREASURY_ADDRESS: '0x3e2464b7Bf7f5126435d549C1Ba49384b3740E7B',
    ZAPIN_ADDRESS: '',
    REDEEM_ADDRESS: '',
};

export interface IAddresses {
    DAO_ADDRESS: string;
    SBASH_ADDRESS: string;
    WSBASH_ADDRESS: string;
    BASH_ADDRESS: string;
    DAI_ADDRESS: string;
    STAKING_ADDRESS: string;
    STAKING_HELPER_ADDRESS: string;
    BASH_BONDING_CALC_ADDRESS: string; // daibondCalc: "0xa5381A8345edfafc42EB9946C36f5715083a42c9";
    TREASURY_ADDRESS: string;
    REDEEM_ADDRESS: string;
    BASH_DAI_LP_ADDRESS: string; // reserves
    BASH_DAI_BOND_ADDRESS: string;
    DAI_BOND_ADDRESS: string;
    ABASH_ADDRESS: string;
    PRESALE_ADDRESS: string;
    PRESALE_REDEMPTION_ADDRESS: string;
}

export const getAddresses = (networkID: number) => {
    console.log('deprecated getAddresses');
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

// dynamic import contract addresses for deployment network
async function getNetworkDeploymentAddresses(deploymentNetwork: string): Promise<IAddresses> {
    const getDeployPath = (contract: string) => `${deploymentNetwork}/${contract}.json`;
    const getAddress = async (contract: string) => {
        const { address } = await import(`../deployments/${getDeployPath(contract)}`); // note: ../deployments must be a literal in this import
        return address;
    };
    const getDeployer = async (contract: string) => {
        const { receipt } = await import(`../deployments/${getDeployPath(contract)}`);
        return receipt.from;
    };

    return {
        DAO_ADDRESS: await getDeployer('BASHERC20Token'),
        SBASH_ADDRESS: await getAddress('sBASH'),
        WSBASH_ADDRESS: await getAddress('wsBASH'),
        BASH_ADDRESS: await getAddress('BASHERC20Token'),
        DAI_ADDRESS: await getAddress('DAI'),
        STAKING_ADDRESS: await getAddress('ATBASHStaking'),
        STAKING_HELPER_ADDRESS: await getAddress('StakingHelper'),
        BASH_BONDING_CALC_ADDRESS: await getAddress('ATBASHBondingCalculator'),
        TREASURY_ADDRESS: await getAddress('BashTreasury'),
        REDEEM_ADDRESS: '', // todo: snowbank redemption, not needed
        BASH_DAI_LP_ADDRESS: await getAddress('BashDaiUniswapPairV2'),
        BASH_DAI_BOND_ADDRESS: await getAddress('bashDaiBondDepository'),
        DAI_BOND_ADDRESS: await getAddress('atbashBondDepository'),
        ABASH_ADDRESS: await getAddress('aBASHERC20'),
        PRESALE_ADDRESS: await getAddress('Presale'),
        PRESALE_REDEMPTION_ADDRESS: await getAddress('PresaleRedemption'),
    };
}

export const getAddressesAsync = async (networkID: number): Promise<IAddresses> => {
    let networkName: string;
    switch (networkID) {
        case Networks.LOCAL:
            networkName = 'localhost';
            break;
        case Networks.MAINNET:
            networkName = 'mainnet';
            break;
        case Networks.RINKEBY:
            networkName = 'rinkeby';
            break;
        default:
            throw Error('Unknown network deployment');
    }
    var addresses = await getNetworkDeploymentAddresses(networkName);
    // console.log("Addresses: %o", addresses);
    return addresses;
};
