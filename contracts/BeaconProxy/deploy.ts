import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Start Deploying....")
  
  const Contract = await ethers.getContractFactory("Ship");

  const beacon = await upgrades.deployBeacon(Contract);
  await beacon.deployed();

  console.log("beacon deployed: ", beacon.address);

  const Factory = await ethers.getContractFactory("ShipFactory");
  const factory = await Factory.deploy(beacon.address);

  console.log("Factory deployed: ", factory.address);

  await factory.buildShip("Bob", 10, 1) // ERR > 'Address: low-level delegate call failed'
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat clean && npx hardhat compile
// npx hardhat run contracts/BeaconProxy/deploy.ts


// async function main() {

//   const Ship = await ethers.getContractFactory("Ship");
//   const ship = await Ship.deploy();

//   console.log("Ship deployed: ", ship.address);

//   const Beacon = await ethers.getContractFactory("ShipBeacon");
//   const beacon = await Beacon.deploy(ship.address);

//   console.log("Beacon deployed: ", beacon.address);

//   const Factory = await ethers.getContractFactory("ShipFactory");
//   const factory = await Factory.deploy(beacon.address);

//   console.log("Factory deployed: ", factory.address);

//   await factory.buildShip("Bob", 10, 1) // ERR > 'Address: low-level delegate call failed'
// }
