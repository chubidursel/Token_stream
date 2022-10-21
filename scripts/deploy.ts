import { ethers } from "hardhat";

async function main() {

  console.log("🚀 deploying scmart contract.....");
  
  const Contract = await ethers.getContractFactory("Storage");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`Smart contract deployed: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
