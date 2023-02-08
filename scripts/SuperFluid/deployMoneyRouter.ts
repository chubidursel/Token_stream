import { ethers } from "hardhat";

async function main() {

  console.log("🚀 deploying scmart contract.....");

  const [deployer, acc1, acc2] = await ethers.getSigners();
  
  const Contract = await ethers.getContractFactory("MoneyRouter");
  const contract = await Contract.deploy(deployer.address);

  await contract.deployed();

  console.log(`Smart contract deployed: ${contract.address}`);
  console.log(`🏁 FINISHED 🏁`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
