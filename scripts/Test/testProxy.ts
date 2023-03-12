import { ethers, upgrades } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testProxy.ts

async function main() {
  console.log("Starting 🏃")

   // ------------ #1 DEPLOY LIB--------------------
   const Lib = await ethers.getContractFactory("ArrayLib");
   const lib = await Lib.deploy();

   console.log("LIBRARY IS DONE: ", lib.address)

 // ------------ #2 Deploy Beacon --------------------

 const company = await ethers.getContractFactory("Company");

 const beacon = await upgrades.deployBeacon(company);

 await beacon.deployed();

 console.log("Beacon deployed: ", beacon.address);

 // ------------ #3 Deploy Facotry --------------------

 const Factory = await ethers.getContractFactory("CompanyFactory");

 const factory = await Factory.deploy(beacon.address);

 await factory.deployed();

 console.log("factory deployed", factory.address);

console.log("Test amount of companies: ", await factory.totalAmounOfComapnies())

 // ------------ #4 CREATE NEW INSTANCE --------------------

await factory.createCompany("Tesla") // ERR > 'Address: low-level delegate call failed'

  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// https://forum.openzeppelin.com/t/how-to-deploy-new-instances-using-beacon-proxy-from-a-factory-when-using-openzeppelin-hardhat-upgrades/27801/9

// NFT factory in Beacon and Hardhat
// https://github.com/weedle-app/weedle-NFT-ERC1155-Upgradeable-Beacon-Proxy/blob/main/migrations/nfts-deploy.ts

// Dude from Utube
//https://gist.github.com/yurenju/ef4c901a48c523ac74bf942b50ab5108

// OPenZeppelin main instruction How to deploy
//https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades#beacon-proxies


// Random dude from medium Hardhat + Beacon
//https://medium.com/coinmonks/how-to-create-a-beacon-proxy-3d55335f7353