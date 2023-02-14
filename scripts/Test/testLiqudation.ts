import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testLiqudation.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("Company");
  //const contract = await Contract.deploy("RogaAndKopita", deployer.address); // << DEPLOY CONTRACT FROM FACTORY

  const ContractUSDT = await ethers.getContractFactory("StableCoin");
  const contractUSDT = await ContractUSDT.deploy();

  const ContractFactory = await ethers.getContractFactory("CompanyFactory");
  const contractFactory = await ContractFactory.deploy();

  await contractUSDT.deployed();

   const txF = await contractFactory.createCompany("Tesla");
   await txF.wait()
   console.log("🏭 Creating new Contract || GasPrice: ", txF.gasPrice?.toString())

   let eventFilter = contractFactory.filters.Creation();
   let events = await contractFactory.queryFilter(eventFilter);
   const addressCompany = events[0].args[0]

   const contract = Contract.attach(
    addressCompany
  );

  console.log("🆕 New Contract Company: ", addressCompany)

 
  console.log("✅ All Contracts has been deployed!")
  
    const tx = await contract.setToken(contractUSDT.address);
    console.log("✅ Token_set|| GasPrice: ", tx.gasPrice?.toString())

  const txCoin = await contractUSDT.mint(contract.address, 1_000_000)
  console.log("✅🟡 Transfer token done! || Transfer: ", 1_000_000)
  await txCoin.wait()

  console.log("---------📈 BUFFER #2 INFO 📈------------")
  console.log(`📈 [SOL#2] Token Limit to add new Employee:  ${(await contract.getTokenLimitToAddNewEmployee(10)).toNumber()}`)
  console.log("📈 [SOL#2] Balance - Limit = ", ((await contract.currentBalanceContract()).toNumber() - (await contract.getTokenLimitToAddNewEmployee(10)).toNumber()))
  

    await contract.addEmployee(acc1.address, 1); 
    console.log("✅ Employee added || Rate [token/sec]: ", ((await contract.allEmployee(acc1.address)).flowRate).toNumber())

    // console.log("---------📈 BUFFER #2 INFO 📈------------")
    // console.log(`📈 [SOL#2] Token Limit to add new Employee:  ${(await contract.getTokenLimitToAddNewEmployee(5)).toNumber()}`)
    // console.log("📈 [SOL#2] Balance - Limit = ", ((await contract.currentBalanceContract()).toNumber() - (await contract.getTokenLimitToAddNewEmployee(5)).toNumber()))
    // console.log(`📈 MATH to add new:  ${(await contract.amountEmployee()).toNumber() + 1} * ${(await contract.commonRateAllEmployee()).toNumber() + 5} * ${(await contract.hoursLimitToAddNewEmployee()).toNumber()}`)
  
    // await contract.addEmployee(acc2.address, 5)
    // console.log("✅ 2 Employess added|| Rate #1 [token/sec]: ", ((await contract.allEmployee(acc1.address)).flowRate).toNumber())


    console.log("---------📈 BUFFER #1 INFO 📈------------")
    console.log(`📈 [SOL#1] Token Limit to Start 1 STREAM:  ${(await contract.getTokenLimitToStreamOne(acc1.address)).toNumber()}`)
    console.log("📈 [SOL#1] Balance - Limit = ", ((await contract.balanceContract()).toNumber() - (await contract.getTokenLimitToStreamOne(acc1.address)).toNumber()))

    console.log()
  console.log("-------------------- LIQUIDATION Procedure [👷] --------------")
  console.log()

  const tx20 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx20.gasPrice?.toString())


   const blockTimestamp5 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp5 + 2000000]); 
  console.log("Wait 2🍋 sec ...")


  console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString())
  console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

  console.log( )
  console.log("-----------STREAM INFO ---------")
  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
  console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
  console.log("📄Stream [EFT - blockTimestamp]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp )

  const tx23 = await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx23.gasPrice?.toString())

console.log("🔥 🔥  🔥  Liquidation", await contract.liqudation())
console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString())
console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

console.log( )
console.log("----------STREAM INFO --------")
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
console.log("📄Stream [EFT - blockTimestamp]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp )

// console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toString())
// console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
// console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
// console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

console.log("--------DEBT INFO --------")
console.log("🔥 Liquidation", await contract.liqudation())
console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())

  await contractUSDT.mint(contract.address, await contract._totalDebt())
  console.log("✅🟡 Minting token done")

  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())

  const payDebt = await contract.finishLiqudation()
  console.log("💸💸💸 PAYED FOR DEBT")

console.log("--------DEBT INFO -------")
console.log("🔥 Liquidation", await contract.liqudation())
console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())
console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())



console.log()
console.log("-------------------- LIQUIDATION Procedure [👷👷👷] --------------")
console.log()

console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())
await contractUSDT.mint(contract.address, 5_000_000)
console.log("✅🟡 Minting token done | 5🍋")
console.log(`📈 [SOL#2] Token Limit to add new Employee:  ${(await contract.getTokenLimitToAddNewEmployee(2)).toNumber()}`)
await contract.addEmployee(acc2.address, 2); 
console.log("✅ Employee #2 added")
console.log(`📈 [SOL#2] Token Limit to add new Employee:  ${(await contract.getTokenLimitToAddNewEmployee(2)).toNumber()}`)
await contract.addEmployee(acc3.address, 3); 
console.log("✅ Employee #3 added")
console.log("📄 Amount Employee: ", (await contract.amountEmployee()).toNumber())

console.log("💥💥💥💥 STREAMING BEGIN 💥💥💥💥 ")

await contract.start(acc1.address);

const blockTimestamp8 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
await ethers.provider.send("evm_mine", [blockTimestamp8 + 100]); 
console.log("⌛ Wait 100 sec ...")
console.log(`📈 [SOL#1] Token Limit to Start 2nd STREAM:  ${(await contract.getTokenLimitToStreamOne(acc2.address)).toNumber()}`)

await contract.start(acc2.address);

const blockTimestamp9 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
await ethers.provider.send("evm_mine", [blockTimestamp9 + 100]); 
console.log("⌛ Wait 100 sec ...")
console.log(`📈 [SOL#1] Token Limit to Start 3rd STREAM:  ${(await contract.getTokenLimitToStreamOne(acc3.address)).toNumber()}`)

await contract.start(acc3.address);

console.log("✅ ✅ ✅  3 streams LIVE now")

const blockTimestamp11 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
await ethers.provider.send("evm_mine", [blockTimestamp11 + 1000000]); 
console.log("Wait 1🍋 sec ...")


console.log("-----------INFO ---------")
console.log("🔥 Liquidation", await contract.liqudation())
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
console.log("📄Stream [EFT - blockTimestamp]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp )
console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toNumber())
console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toNumber())
console.log("🌊 Employee #3 has: ", (await contract.currentBalanceEmployee(acc3.address)).toNumber())
console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
console.log("🟡Real Balance [Employee #3]: ", (await contractUSDT.balanceOf(acc3.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())
console.log( )
console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())
console.log("🌊💸 Employee #2 DEBT: ", (await contract.debtToEmployee(acc2.address)).toString())
console.log("🌊💸 Employee #3 DEBT: ", (await contract.debtToEmployee(acc3.address)).toString())
console.log("---------------")


await contract.finishAllStream();
console.log(`🏁 Finish All stream`);

console.log("-----------INFO ---------")
console.log("🔥 Liquidation: ", await contract.liqudation())
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())

console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())
console.log("🌊💸 Employee #2 DEBT: ", (await contract.debtToEmployee(acc2.address)).toString())
console.log("🌊💸 Employee #3 DEBT: ", (await contract.debtToEmployee(acc3.address)).toString())

console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
console.log("🟡Real Balance [Employee #3]: ", (await contractUSDT.balanceOf(acc3.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

await contractUSDT.mint(contract.address, await contract._totalDebt())
console.log("✅🟡 Minting token done")

await contract.finishLiqudation()
console.log("💸💸💸 PAYED FOR DEBT")

console.log("-----------INFO ---------")
console.log("🔥 Liquidation: ", await contract.liqudation())
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())

console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())
console.log("🌊💸 Employee #2 DEBT: ", (await contract.debtToEmployee(acc2.address)).toString())
console.log("🌊💸 Employee #3 DEBT: ", (await contract.debtToEmployee(acc3.address)).toString())

console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
console.log("🟡Real Balance [Employee #3]: ", (await contractUSDT.balanceOf(acc3.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())



  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





//---------------- USEFUL CODE --------------


 // function sleep(milliseconds : number) {
  //   const date = Date.now();
  //   let currentDate = null;
  //   do {
  //     currentDate = Date.now();
  //   } while (currentDate - date < milliseconds);
  // }
  // sleep(5000)


  //----------------- EVENTS --------------
// console.log("📢 EVENTS" ,  contract.filters.AddEmployee())
// contractUSDT.on("Transfer", (to, amount, from) => {
//   console.log("📢🟡 EVENTS", to, amount, from);
// });

//----------------- INFO --------------
// const info1 = await contract.totalAmountEmployee();
// const info2 = await contract.allEmployee(acc1.address);
// console.log("📄 INFO [ amount employee ] ➡️  ", info1.toString())
// console.log("📄 INFO [ info employee #1 ] ➡️  ", info2.flowRate)

// const infoToken1 = await contractUSDT.balanceOf(deployer.address);
// console.log("📄🟡 INFO [ Balance ] ➡️  ", infoToken1.toString())

// console.log("📄📕 INFO [ blocknumber ] ➡️  ",  await ethers.provider.getBlockNumber())
// console.log("📄📕 INFO [ acc1 = eth ] ➡️  ",  await ethers.provider.getBalance(deployer.address))
// console.log("📄📕 INFO [ gas price ] ➡️  ",  ethers.utils.formatEther(await ethers.provider.getGasPrice()), "gwei")