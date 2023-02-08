import { ethers } from "hardhat";

async function main() {
  console.log("Starting Deploying....")

  const Contract = await ethers.getContractFactory("registrateOrganization");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`SC Deployed! Address: ${contract.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deployFactory.ts