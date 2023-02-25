import { ethers } from "hardhat";

async function main() {
  console.log("Starting Deploying....")


  // ADDR ARR_LIB MUMBAI =>    0xF21319a05548495D49141Db8653C5B4F622AdB7c
  // ETH    ARR_LIBRARY => 0x52746Cd96040469447C887C1C25d257943D9ec9c
  // BSC    ARR_LIBRARY => 0xF21319a05548495D49141Db8653C5B4F622AdB7c
  const Contract = await ethers.getContractFactory("CompanyFactory", { libraries: { ArrayLib:  "0xF21319a05548495D49141Db8653C5B4F622AdB7c"} });
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`SC Deployed! Address: ${contract.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deployFactory.ts