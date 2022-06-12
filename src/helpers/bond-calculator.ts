import { Contract, providers } from 'ethers';

import { BondingCalcContract } from '../abi';
import { getAddresses } from '../constants/addresses';
import { Networks } from '../constants/blockchain';

export function getBondCalculator(networkID: Networks, provider: providers.StaticJsonRpcProvider) {
    const addresses = getAddresses(networkID);
    return new Contract(addresses.BASH_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
}
