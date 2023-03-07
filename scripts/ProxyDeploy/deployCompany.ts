import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Starting Deploying....")

  const Contract = await ethers.getContractFactory("Company");
  const beacon = await upgrades.deployBeacon(Contract);
  await beacon.deployed();

  console.log("beacon deployed: ", beacon.address);

  const Factory = await ethers.getContractFactory("CompanyFactory");
  const factory = await Factory.deploy(beacon.address)


  console.log("Factory deployed: ", factory.address);


}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run --network goerli scripts/ProxyDeploy/deployCompany.ts