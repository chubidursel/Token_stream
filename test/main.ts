import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run test/main.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2] = await ethers.getSigners();

// ----------------CONTRACTS---------------------
  const ContractUSDT = await ethers.getContractFactory("StableCoin");
  const contractUSDT = await ContractUSDT.deploy();

  console.log("✅ Contracts deployed!", contractUSDT.address)



//---------------------- TX_COIN ------------
  const txCoin = await contractUSDT.transfer(acc1.address, 1000)
  console.log("✅🟡 Transfer token")

//----------------- EVENTS --------------
// console.log("📢 EVENTS" ,  contract.filters.AddEmployee())
// contractUSDT.on("Transfer", (to, amount, from) => {
//   console.log("📢🟡 EVENTS", to, amount, from);
// });

//----------------- INFO --------------
const infoToken1 = await contractUSDT.balanceOf(deployer.address);
console.log("📄🟡 INFO [ Balance ] ➡️  ", infoToken1.toString())

console.log("📄📕 INFO [ blocknumber ] ➡️  ",  await ethers.provider.getBlockNumber())
console.log("📄📕 INFO [ acc1 = eth ] ➡️  ",  await ethers.provider.getBalance(deployer.address))
console.log("📄📕 INFO [ gas price ] ➡️  ",  ethers.utils.formatEther(await ethers.provider.getGasPrice()), "gwei")

  console.log(`🏁 FINISHED 🏁`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});