import hre, { ethers } from "hardhat";
// import { add } from "lodash";
import { TimeTokenContract, MemoTokenContract } from "../src/abi";
import { getAddresses  } from "../src/constants";

import { LpReserveContract } from "../src/abi";
import { BASHDAI } from "../src/helpers/bond";

async function main() {
    console.log("testing");
    await getMarketPrice();

        return;

    var provider = hre.ethers.provider;
    var chainId = (await provider.getNetwork()).chainId;
    const addresses = getAddresses(chainId);

    console.log("Provider ID: ", await provider.getNetwork());
    const me = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const sbContract = new hre.ethers.Contract(addresses.BASH_ADDRESS, TimeTokenContract, provider);
    const sBASHContract = new hre.ethers.Contract(addresses.SBASH_ADDRESS, MemoTokenContract, provider);

    const BASHbalance = await sbContract.balanceOf(me);
    console.log("BASHbalance: ", BASHbalance);

    const sBASHBalance = await sBASHContract.balanceOf(addresses.STAKING_ADDRESS);
    console.log("sBASH in staking: ", sBASHBalance);

    console.log("sBASH in me: ", (await sBASHContract.balanceOf(me)));



    
}

async function getMarketPrice() {
    const ohdami = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // ohmdai pair rinkeby
    var provider = hre.ethers.provider;
    var chainId = (await provider.getNetwork()).chainId;
    // const addresses = getAddresses(chainId);

    console.log("Provider ID: ", await provider.getNetwork());
    // const BASHUSDCAddress = BASHUSDC.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(ohdami, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    console.log(`r[0]: ${reserves[0]}, r[1]: ${reserves[1]}, market price: ${marketPrice}`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  