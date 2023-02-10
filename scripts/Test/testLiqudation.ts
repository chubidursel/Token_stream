import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testLogic.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, admin] = await ethers.getSigners();

// ----------------CONTRACTS---------------------
  const Contract = await ethers.getContractFactory("Company");
  //const contract = await Contract.deploy("RogaAndKopita", deployer.address); // << DEPLOY CONTRACT FROM FACTORY

  const ContractUSDT = await ethers.getContractFactory("StableCoin");
  const contractUSDT = await ContractUSDT.deploy();

  const ContractFactory = await ethers.getContractFactory("CompanyFactory");
  const contractFactory = await ContractFactory.deploy();

  //await contract.deployed();
  await contractUSDT.deployed();


 
  const addressUSDT = contractUSDT.address;

   // ------------------ TX_COMPANY_SETTING ------------------  
   const txF = await contractFactory.createCompany("Tesla");
   await txF.wait()
   console.log("🏭 Creating new Contract || GasPrice: ", txF.gasPrice?.toString())

   let eventFilter = contractFactory.filters.Creation();
   let events = await contractFactory.queryFilter(eventFilter);
   const addressCompany = events[0].args[0]

// SETTING NEW CONTRACT FROM FACTORY
   const contract = await Contract.attach(
    addressCompany
  );


  console.log("New Contract Company: ", addressCompany)

 
  console.log("✅ All Contracts has been deployed!")

  // ------------------ TX_COMPANY_SETTING ------------------   
    const tx = await contract.setToken(addressUSDT);
    console.log("✅ Token_set|| GasPrice: ", tx.gasPrice?.toString())

  const txCoin = await contractUSDT.mint(contract.address, 1_000_000)
  console.log("✅🟡 Transfer token done! || GasPrice: ", txCoin.gasPrice?.toString())
  await txCoin.wait()

    const tx3 = await contract.addEmployee(acc1.address, 10); // calculation of rate grab from Front
    console.log("✅ Emplployee #1 added|| GasPrice: ", tx3.gasPrice?.toString())

    const tx4 = await contract.addEmployee(acc2.address, 100);
    console.log("✅ Emplployee #2 added || GasPrice: ", tx4.gasPrice?.toString())


 // ------------------ ACCESS CONTROL FUNC ------------------
  const txAC = await contract.changeAdmin(admin.address);
  console.log("👨‍💼 Admin set || GasPrice: ", txAC.gasPrice?.toString())
  console.log("👨‍💼 Admin address: ", await contract.owner())
  console.log("👨‍💼 Owner address: ", await contract.administrator())


 // ------------------ TX_COMPANY_OPERATION ------------------ 
 
  const tx5 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx5.gasPrice?.toString())

  // console.log("Stream info about employee: ", await contract.getStream(acc1.address))

  //----------- FUNC FROM StreamLogic ------------
    console.log( )
    console.log("---------------STREAM INFO --------------")
    console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
    console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
    console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
    console.log("-----------------------------")
    console.log( )


    console.log( )
    console.log("---------------BALANCE CHECK--------------")
    console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString()) 
    console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
    console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
    console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())
    console.log("-----------------------------")
    console.log( )
  

  // SKIP BLOCKS
    const blockTimestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    await ethers.provider.send("evm_mine", [blockTimestamp + 10]); // <- 10 sec
    console.log("Wait 10 sec ...")


  console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString()) 
  console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

    // SKIP BLOCKS
    const blockTimestamp2 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    await ethers.provider.send("evm_mine", [blockTimestamp2 + 20]); // <- 10 sec
    console.log("Wait 20 sec ...")

    console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString()) 
    console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

  // const employInfo = await contract.allEmployee(acc1.address)
  // console.log("Employee info from company Contract: ", employInfo)

  const employStream = await contract.getStream(acc1.address)
  console.log("Stream info about employee: ", employStream.active)

  const tx6 = await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx6.gasPrice?.toString())

  console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())


  console.log("-------------------- PART II  [ check 2 streams ]--------------")
  console.log()

  const tx10 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx10.gasPrice?.toString())

  const blockTimestamp3 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp3 + 20]); // <- 10 sec
  console.log("Wait 20 sec ...")

  console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString()) 
  console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

  const tx11 = await contract.start(acc2.address);
  console.log("👷 Emplployee #2 Came to Work || GasPrice: ", tx11.gasPrice?.toString())

  
  const blockTimestamp4 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp4 + 20]); // <- 10 sec
  console.log("Wait 20 sec ...")

  console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString())
  console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toString())  
  console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

  console.log( )
  console.log("---------------STREAM INFO --------------")
  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
  console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
  console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
  console.log("-----------------------------")
  console.log( )

  const tx13 = await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx13.gasPrice?.toString())
  const tx14 = await contract.finish(acc2.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx14.gasPrice?.toString())

  console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
  console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

  console.log( )
  console.log("---------------STREAM INFO --------------")
  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
  console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
  console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
  console.log("-----------------------------")
  console.log( )


    //----------------- EVENTS --------------
console.log("📢 EVENTS")
//const eventsAll = await contract.queryFilter("*" as any, 0,  (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;)
const blockNumber = await ethers.provider.getBlockNumber();

// Get all events from the contract from block 0 to the latest block
const eventsAddEmployee = await contract.queryFilter(
  contract.filters["AddEmployee(address,uint256)"](),
  0,
  blockNumber
);
console.log("Amount Evetns: ", eventsAddEmployee.length)


const eventsStartStream = await contract.queryFilter(
  contract.filters.StreamCreated(),
  0,
  blockNumber
);

console.log("Stream Created Evetns: ", eventsStartStream[0].args)

// let eventFilterFinish = contract.filters["StreamFinished(address,uint256,uint256)"];
// let eventsFinishStream = await contractFactory.queryFilter(eventFilterFinish);
// console.log("📢 EVENTS FINISH: ", eventsFinishStream.length)



  console.log("-------------------- PART III  [ check 2 streams & Liqudation ]--------------")
  console.log()

  const tx20 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx20.gasPrice?.toString())
  const tx21 = await contract.start(acc2.address);
  console.log("👷 Emplployee #2 Came to Work || GasPrice: ", tx21.gasPrice?.toString())

  const blockTimestamp5 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp5 + 10000]); 
  console.log("Wait 10000 sec ...")


  console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString())
  console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toString())
  
  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())
  console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())

  console.log( )
  console.log("---------------STREAM INFO --------------")
  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
  console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
  console.log("📄Stream [EFT - blockTimestamp]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp )
  console.log("-----------------------------")
  console.log( )

  const tx23 = await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx23.gasPrice?.toString())

console.log("🔥 🔥  🔥  Liquidation", await contract.liqudation())
console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString())
console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toString())
console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

console.log( )
console.log("---------------STREAM INFO --------------")
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
console.log("📄Stream [EFT - blockTimestamp]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp )
console.log("-----------------------------")
console.log( )

const tx24 = await contract.finish(acc2.address);
console.log("👷 Emplployee #2 Left || GasPrice: ", tx24.gasPrice?.toString())

console.log("🌊 Employee #2 has: ", (await contract.currentBalanceEmployee(acc2.address)).toString())
console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

console.log("---------------DEBT INFO --------------")
console.log("🔥 Liquidation", await contract.liqudation())
console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #2 DEBT: ", (await contract.debtToEmployee(acc2.address)).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())

  await contractUSDT.transfer(contract.address, await contract._totalDebt())
  console.log("✅🟡 Transfer token done")

  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())

  const payDebt = await contract.finishLiqudation()
  console.log("💸💸💸 PAYED FOR DEBT")

console.log("---------------DEBT INFO --------------")
console.log("🔥 Liquidation", await contract.liqudation())
console.log("💸💸 Total Debt SC: ", (await contract._totalDebt()).toString())
console.log("🌊💸 Employee #2 DEBT: ", (await contract.debtToEmployee(acc2.address)).toString())
console.log("🌊💸 Employee #1 DEBT: ", (await contract.debtToEmployee(acc1.address)).toString())
console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
console.log("🟡Real Balance [Employee #2]: ", (await contractUSDT.balanceOf(acc2.address)).toString())
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