import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

import { BondingCalcContract } from '../abi';
import { getAddresses } from '../constants/addresses';
import { Networks } from '../constants/blockchain';

export function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider) {
    const addresses = getAddresses(networkID);
    return new ethers.Contract(addresses.BASH_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
}
