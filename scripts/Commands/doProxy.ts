import { ethers, upgrades } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run test/main.ts

async function main() {
  console.log("Starting 🏃")

// --------------- Block #1 ----------------

  // const Box = await ethers.getContractFactory("Company")
  // console.log("Deploying Box...")
  // const box = await upgrades.deployProxy(Box,[42], { initializer: 'store' })

  // console.log(box.address," box(proxy) address")
  // console.log(await upgrades.erc1967.getImplementationAddress(box.address)," getImplementationAddress")
  // console.log(await upgrades.erc1967.getAdminAddress(box.address)," getAdminAddress")    

  // --------------- Block #2 ----------------
  const proxyAddress = "0x19752824d048aD975e7b48e098A84489252451cf"
  
  console.log(proxyAddress," original Box(proxy) address")
  const BoxV2 = await ethers.getContractFactory("BoxV2")
  console.log("upgrade to BoxV2...")
  const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2)
  console.log(boxV2.address," BoxV2 address(should be the same)")

  console.log(await upgrades.erc1967.getImplementationAddress(boxV2.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(boxV2.address), " getAdminAddress")    


  console.log(`🏁 FINISHED 🏁`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});