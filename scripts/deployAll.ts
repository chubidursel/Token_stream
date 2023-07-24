import { ethers } from "hardhat";

async function main() {
  console.log("Starting Deploying....")
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  // ------ DEPLOY ARR_LIB --------
    // const ContractLibrary = await ethers.getContractFactory("ArrayLib");
    // const contractLibrary = await ContractLibrary.deploy();
    // const res1 = await contractLibrary.deployed()
    // await res1.wait(5)
    // console.log("Library has been deployed: ", res1.address)

  // ------ DEPLOY COMPANY_IMPLEMENTAION --------

    const Contract = await ethers.getContractFactory("Company");
    const contract = await Contract.deploy();
    const res2 = await contract.deployed();
    console.log(`Company implementation is done: ${res2.address}`);

      // ------ DEPLOY FACTORY_IMPLEMENTAION --------
    const ContractFactory = await ethers.getContractFactory('CompanyFactory')
    const contractFactory = await ContractFactory.deploy(res2.address);
    const res3 = await contractFactory.deployed();
    console.log(`Factory is done: ${res3.address}`);

    console.log(`Deployer balance: ${await deployer.getBalance()}`);
    console.log("Finished!")
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run --network opBnb scripts/deployAll.ts