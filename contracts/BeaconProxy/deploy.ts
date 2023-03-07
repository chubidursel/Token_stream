import { ethers, upgrades } from "hardhat";



async function main() {
  console.log("Starting Deploying....")
  const [deployer] = await ethers.getSigners();



  const Contract = await ethers.getContractFactory("Ship");
  const beacon = await upgrades.deployBeacon(Contract);
  await beacon.deployed();

  console.log("beacon deployed: ", beacon.address);

  const Factory = await ethers.getContractFactory("ShipFactory");
  const factory = await Factory.deploy(beacon.address)


  console.log("Factory deployed: ", factory.address);
  console.log("DEV!!!!! BEACON ", await factory.getBeacon());


  await factory.buildShip("Ivan", 10, 1)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat clean && npx hardhat compile
// npx hardhat run contracts/BeaconProxy/deploy.ts

