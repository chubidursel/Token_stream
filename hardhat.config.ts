import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

import dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    }, 
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_RINKEBY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    }},
    etherscan: {
      apiKey: process.env.ETHERSCAN_VERIFY,
    },
};

export default config;
