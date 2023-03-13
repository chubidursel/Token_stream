import { ethers, upgrades } from "hardhat";

// async function main() {
//   console.log("Start Deploying....")
  
//   const Contract = await ethers.getContractFactory("Ship");

//   const beacon = await upgrades.deployBeacon(Contract);
//   await beacon.deployed();

//   console.log("beacon deployed: ", beacon.address);

//   const Factory = await ethers.getContractFactory("ShipFactory");

//   const factory = await Factory.deploy(beacon.address);

//   console.log("Factory deployed: ", factory.address);

//   await factory.buildShip("Bob", 10, 1) // ERR > 'Address: low-level delegate call failed'
// }

async function main() {

  //--------- STEP #1 -------------
  const Ship = await ethers.getContractFactory("Ship");
  const ship = await Ship.deploy();

  console.log("Ship implementation deployed: ", ship.address);

    //--------- STEP #2 -------------
  const Factory = await ethers.getContractFactory("ShipFactory");
  const factory = await Factory.deploy(ship.address);

  console.log("Factory deployed: ", factory.address);
  console.log("Get beacon address from factory: ", await factory.getBeacon());

  //console.log("DEV!!!! encodeWithSelector", await factory.demoSelector(2))
  
  await factory.buildShip("Bob", 10, 1) 

  const addressNewShip = await factory.getShipAddress(1)
  console.log('🐑 New contract: ', addressNewShip)

    //--------- STEP #3 -------------
    const shipProxy = Ship.attach(addressNewShip)

    console.log("🐑 Name: ", await shipProxy.name())
    console.log("🐑 Fuel: ", await shipProxy.fuel())
    await shipProxy.move()
    console.log("🐑 Fuel (after 1st move): ", await shipProxy.fuel())

    //--------- STEP #4 -------------

    const ShipV2 = await ethers.getContractFactory("ShipV2");
    const shipv2 = await ShipV2.deploy();

    console.log("Ship implementation V2 deployed: ", shipv2.address);

    // BEACON HAS BEEN DEPLOYED AUTOMATICALY
    const Beacon = await ethers.getContractFactory("ShipBeacon");
    const beaconShip = Beacon.attach(await factory.getBeacon())

    console.log("V1 implementation: ", await beaconShip.implementation())

    await beaconShip.update(shipv2.address)

    console.log("V2 implementation: ", await beaconShip.implementation())

    //--------- STEP #5  -------------
    const shipProxyV2 = ShipV2.attach(addressNewShip)
    console.log("🐑 Name: ", await shipProxyV2.name())
    console.log("🐑 Fuel: ", await shipProxyV2.fuel())

    await shipProxyV2.refuel()
    console.log("🐑 ReFuel: ", await shipProxyV2.fuel())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat clean && npx hardhat compile
// npx hardhat run contracts/BeaconProxy/deploy.ts
// npx hardhat run --network goerli contracts/BeaconProxy/deploy.ts


// npx hardhat verify --network goerli 0x0A308c50926bf638D62Ff89C57AdA3AD4aA375c8 0x59d05583CB67B1d32f9C4b0081A73d4a59a58Ec5


// > npx hardhat console --network goerli    

// const c = await ethers.getContractAt("ShipV2", '0x67ff44aa4BAF783EEa6FFA3aADBF2BDd6e2676b7')  

