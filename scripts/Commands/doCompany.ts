import { ethers } from "hardhat";
// npx hardhat run --network goerli scripts/Commands/doCompany.ts


async function main() {
  console.log("🏃 Starting")

  const contract = await ethers.getContractAt("Company", '0x942692dEc8F10853b6614c5408Adb7B729Efcb6c')
  const contractUSDT = await ethers.getContractAt("StableCoin", '0x09658986040e210120c30e38d59A4517716A4E8F')
 
  try {
   //------- SET TOKEN---------
   const tx1 = await contract.setToken(contractUSDT.address)
   await tx1.wait(1);
   console.log("✔️ Set token DONE")

   const tx2 = await contractUSDT.mint(contract.address, 1_000_000_000)
   await tx2.wait(1)
   console.log("✔️ Mint token DONE")

   await contract.changeAdmin("0x1AFaF7463894656662E6BdcbDC77522775E6acbB")
  

   await contract.addEmployee("0x63018F44E822875Be96e7CE6F5b53cB1dEcA1B96", 1)
 

   const tx5 = await contract.addEmployee("0x35fe6f7077886Bf5C4890f4D180F09831431A3cF", 2)
   await tx5.wait(1)

   console.log("✔️ 2 Employees and Admin =  DONE")

   const tx6 = await contract.start("0x63018F44E822875Be96e7CE6F5b53cB1dEcA1B96")
   await tx6.wait(4)

   const tx7 = await contract.finish("0x63018F44E822875Be96e7CE6F5b53cB1dEcA1B96")
   await tx7.wait(1)

   const amountEmployee = await contract.amountEmployee();
   console.log("Amount Employee: ", amountEmployee.toNumber())

   const bal = await contractUSDT.balanceOf(contract.address);
   console.log("Contract Balance: ", bal.toNumber())

   console.log("✔️ FINSIHED ✔️ ")
    
  } catch (error) {
    console.log(error)
  }
  console.log(`🏁 DONE`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});