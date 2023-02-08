import { ethers } from "hardhat";
// npx hardhat run --network goerli scripts/Commands/doCompany.ts

import data from "../../artifacts/contracts/Company.sol/Company.json"
const provider = new ethers.providers.InfuraProvider("goerli");
const address = "0x3a0745B0bB32d7b169214968722868CF7F1Ba197"

async function main() {
  console.log("🏃 Starting")

 const contract = new ethers.Contract(address, data.abi, provider)
 const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
 const contractWithSigner = contract.connect(wallet);

 console.log(wallet);
 
  try {
   const infoBal = await contract.balanceContract();
    console.log("📄 Balance", infoBal.toString())

    // const res = await contractWithSigner.addEmployee("0x63018F44E822875Be96e7CE6F5b53cB1dEcA1B96", 1)
    // await res.await(1)
    // console.log("✔️ Tx: ", res)
    
  } catch (error) {
    console.log(error)
  }
  console.log(`🏁 DONE`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});