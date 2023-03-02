import { ethers } from "hardhat";

async function main() {
  console.log("🏃 Starting Deploying....")

  const [deployer] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("Company", { libraries: { ArrayLib:  "0x52746Cd96040469447C887C1C25d257943D9ec9c"} });
  const contract = await Contract.deploy("DemoV2", deployer.address);

  await contract.deployed();

  console.log("👨 The owner of smart contract is: ", deployer.address);
  console.log(`🔥 SC Deployed! Address: ${contract.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deployFactory.ts