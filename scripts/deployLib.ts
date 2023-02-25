import { ethers } from "hardhat";

async function main() {
  console.log("🏃 Starting Deploying....")

  const [deployer] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("ArrayLib");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log("👨 The owner of smart contract is: ", deployer.address);
  console.log(`🔥 SC Deployed! Address: ${contract.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
