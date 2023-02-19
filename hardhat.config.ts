import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades"

import dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {                             // `${process.env.ALCHEMY_API}`
      url: `${process.env.ALCHEMY_API}`, //url: `https://goerli.infura.io/v3/${process.env.INFURA_RINKEBY}`, 
      accounts: [`${process.env.PRIVATE_KEY}`]
    }},
    etherscan: {
      apiKey: process.env.ETHERSCAN_VERIFY,
    },
};

export default config;
