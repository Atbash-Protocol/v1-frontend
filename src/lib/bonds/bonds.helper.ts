import { JsonRpcSigner } from "@ethersproject/providers";
import { Networks } from "constants/blockchain";
import { ethers } from "ethers";
import { Bond, BondOptions } from "./bond/bond";
import { LPBond } from "./bond/lp-bond";
import { BondAddresses, BondConfig, BondType } from "./bonds.types";

export const createBond = (bondConfig: BondOptions): LPBond => {
    switch (bondConfig.type) {
        case BondType.LP:
            return new LPBond(bondConfig);

        default:
            throw new Error("Unedefined bond type");
    }
};

export const getBondContracts = (bondConfig: BondConfig, networkID: Networks): BondAddresses => {
    const addresses = bondConfig.addresses[networkID];

    if (!addresses || !addresses.bondAddress || !addresses.reserveAddress) throw new Error("Unable to get bond addresses");

    return { bondAddress: addresses.bondAddress, reserveAddress: addresses.reserveAddress };
};
