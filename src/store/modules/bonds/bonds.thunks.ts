import { JsonRpcSigner } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BondingCalcContract } from "abi";

import { BONDS } from "config/bonds";
import { getAddresses } from "constants/addresses";
import { ethers } from "ethers";
import { createBond, getBondContracts } from "lib/bonds/bonds.helper";

export const initializeBonds = createAsyncThunk("app/bonds", async (signer: JsonRpcSigner) => {
    const chainID = await signer.getChainId();

    // init bond calculator
    const { BASH_BONDING_CALC_ADDRESS } = getAddresses(chainID);

    const bondCalculator = new ethers.Contract(BASH_BONDING_CALC_ADDRESS, BondingCalcContract, signer);

    const bonds = BONDS.map(async bondConfig => {
        const cBOND = createBond({ ...bondConfig, networkID: chainID });

        const contracts = getBondContracts(bondConfig, chainID);

        cBOND.initializeContracts(contracts, signer);
    });

    return {
        bonds,
    };
});
