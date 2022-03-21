import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

var TimeContract = require("./src/abi/tokens/TimeContract.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


task("test", "Tests", async (taskArgs, hre) => {
  console.log("test");
   
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.10", 
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.7.5",
        settings: {optimizer: {
          enabled: true,
          runs: 200,
          
        },},
      },
    ],
  },
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/bMWoFoO8gCdu2av_08twsH8vqoW5ics6`,
      accounts:['0x8a547cf41826cf02af2266c11e463a4bda640fd74bcb7c80172d6477509d2da9'], 
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/uykTntpbG5i8zh6hNeqTBu2kB-HuAuYe`,
      accounts:['0x8a547cf41826cf02af2266c11e463a4bda640fd74bcb7c80172d6477509d2da9'], 
      gas: 2100000,
      gasPrice: 8000000000,
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/jZ09IQNcG0-UiQkRLj1sWNcWhSKvdCxf`,
        accounts:['0x8a547cf41826cf02af2266c11e463a4bda640fd74bcb7c80172d6477509d2da9'], 
      }
    }
  },
//   gasReporter: {
//     enabled: process.env.REPORT_GAS !== undefined,
//     currency: "USD",
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY,
//   },
  /*contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    //only: [':ERC20$'],
  },*/
};
