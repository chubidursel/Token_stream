import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testLogic.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

  // ----------------DEPLOY LIB---------------------
  const Lib = await ethers.getContractFactory("ArrayLib");
  const lib = await Lib.deploy();

  console.log("LIB IS DONE: ", lib.address)
// ----------------CONTRACTS---------------------
  const Contract = await ethers.getContractFactory("Company", {
    libraries: {
      ArrayLib: lib.address
    }});

  const ContractUSDT = await ethers.getContractFactory("StableCoin");
  const contractUSDT = await ContractUSDT.deploy();

  const ContractFactory = await ethers.getContractFactory("CompanyFactory", {
    libraries: {
      ArrayLib: lib.address
    }});
  const contractFactory = await ContractFactory.deploy();

  await contractUSDT.deployed();
  
   // ------------------ TX_COMPANY_SETTING ------------------  
   const txF = await contractFactory.createCompany("Tesla");
   await txF.wait()
   console.log("🏭 Creating new Contract || GasPrice: ", txF.gasPrice?.toString())

   let eventFilter = contractFactory.filters.Creation();
   let events = await contractFactory.queryFilter(eventFilter);
   const addressCompany = events[0].args[0]
   
// SETTING NEW CONTRACT FROM FACTORY
   const contract = Contract.attach(
    addressCompany
  );

  console.log("🆕 New Contract Company: ", addressCompany)

 
  console.log("✅ All Contracts has been deployed!")

  // ------------------ TX_COMPANY_SETTING ------------------   
    const tx = await contract.setToken(contractUSDT.address);
    console.log("✅ Token_set|| GasPrice: ", tx.gasPrice?.toString())

  const txCoin = await contractUSDT.mint(contract.address, 1_000_000_000)
  console.log("✅🟡 Transfer token done! || GasPrice: ", txCoin.gasPrice?.toString())
  await txCoin.wait()

    const tx3 = await contract.addEmployee(acc1.address, 10); // calculation of rate grab from Front
    console.log("✅ Emplployee #1 added|| GasPrice: ", tx3.gasPrice?.toString())

    const tx4 = await contract.addEmployee(acc2.address, 5);
    console.log("✅ Emplployee #2 added || GasPrice: ", tx4.gasPrice?.toString())

 // ------------------ ACCESS CONTROL FUNC ------------------
  const txAC = await contract.changeAdmin(admin.address);
  console.log("👨‍💼 Admin set || GasPrice: ", txAC.gasPrice?.toString())
  console.log("👨‍💼 Admin address: ", await contract.owner())
  console.log("👨‍💼 Owner address: ", await contract.administrator())


 // ------------------ TX_COMPANY_OPERATION ------------------ 
 console.log()
 console.log("💥💥💥💥 STREAMING #1 STARTED 💥💥💥💥 ")

 console.log(`📈 [SOL#1] Token Limit to Start 1 STREAM:  ${(await contract.getTokenLimitToStreamOne(acc1.address)).toNumber()}`)
 console.log("📈 [SOL#1] Balance - Limit = ", ((await contract.balanceContract()).toNumber() - (await contract.getTokenLimitToStreamOne(acc1.address)).toNumber()))
 
   const tx5 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx5.gasPrice?.toString())

  // console.log("Stream info about employee: ", await contract.getStream(acc1.address))

  //----------- FUNC FROM StreamLogic ------------
 
    console.log("---------STREAM INFO ------------")
    console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
    console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
    console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
    console.log("-------------------------")



  
    console.log("-------BALANCE CHECK-------")
    console.log("🌊 Employee #1 has: ", (await contract.currentBalanceEmployee(acc1.address)).toString()) 
    console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
    console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
    console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())
    console.log("----------------")

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
  console.log("🏁 STREAMING #1 FINISHED 🏁 ")

  console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toString())
  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toString())

  console.log()
  console.log("#####################    PART II  [ check 2 streams ] #######################")


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


  console.log("---------------STREAM INFO --------------")
  console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
  console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
  console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
  console.log("-----------------------------")
  console.log( )

  console.log("----- DELETE employee-----")
   console.log(`🗑️ Amount of all employee: ${(await contract.amountEmployee()).toNumber()}`)
  console.log(`🗑️ Employee info: ${(await contract.allEmployee(acc2.address))}`)

  const txModify = await contract.modifyRate(acc2.address, 77)
  console.log("💱 The rate is changed!")

  console.log(`💱 Employee info: ${(await contract.allEmployee(acc2.address))}`)

  const txDelete = await contract.deleteEmployee(acc2.address)
  console.log(`🗑️ Amount of all employee: ${(await contract.amountEmployee()).toNumber()}`)
  console.log(`🗑️ Employee info: ${(await contract.allEmployee(acc2.address))}`)


  console.log()
  console.log("#####################    PART III  [ 5 streams ] #######################")

  await contract.addEmployee(acc3.address, 21); 
  await contract.addEmployee(acc4.address, 10); 
  await contract.addEmployee(acc5.address, 10);
  await contract.addEmployee(acc6.address, 12);

  console.log("✅ Add 4 Employess ")
 
  console.log("---------📈 BUFFER INFO 📈------------")

  console.log("💥💥💥💥 STREAMING BEGIN 💥💥💥💥 ")

 await contract.start(acc1.address);
 await contract.start(acc3.address);
 await contract.start(acc4.address);

 console.log("👷 3 Employee Statred")

 const blockTimestamp5 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
 await ethers.provider.send("evm_mine", [blockTimestamp5 + 20]); // <- 10 sec
 console.log("⌛   Wait 20 sec ...")

 console.log("---------STREAM INFO ------------")
 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
 console.log("📄Stream [EFT - NOW ]: ", (await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp)
 console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
 console.log("-------------------------")

 const blockTimestamp6 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
 await ethers.provider.send("evm_mine", [blockTimestamp6 + 10]); // <- 10 sec
 console.log("⌛   Wait 10 sec ...")

 console.log("---------STREAM INFO ------------")
 console.log("📄Stream [EFT - NOW ] in HOURS: ", ((await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) / 60 / 60 )
 console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())
 console.log("-------------------------")
  
 await contract.start(acc5.address);
 await contract.start(acc6.address);
 console.log("👷 + 2 Employee Statred")

 const blockTimestamp7 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
 await ethers.provider.send("evm_mine", [blockTimestamp7 + 20_000]); // 
 console.log("⌛   Wait 20_000 sec ...")

 console.log("---------STREAM INFO ------------")
 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())
 console.log("📄Stream [EFT - NOW ] in HOURS: ", ((await contract.EFT()).toNumber() - (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) / 60 / 60 )
 console.log("🌊 SC has: ", (await contract.currentBalanceContract()).toString())



 await contract.finishAllStream();
  console.log(`🏁 All Stream are done`)
  console.log("🟡Real Balance [Employee #1]: ", (await contractUSDT.balanceOf(acc1.address)).toNumber())
  console.log("🟡Real Balance [Employee #3]: ", (await contractUSDT.balanceOf(acc3.address)).toNumber())
  console.log("🟡Real Balance [Employee #4]: ", (await contractUSDT.balanceOf(acc4.address)).toNumber())
  console.log("🟡Real Balance [Employee #5]: ", (await contractUSDT.balanceOf(acc5.address)).toNumber())
  console.log("🟡Real Balance [Employee #6]: ", (await contractUSDT.balanceOf(acc6.address)).toNumber())

  console.log("🟡Real Balance [Company SC]: ", (await contractUSDT.balanceOf(addressCompany)).toNumber())


  console.log()
 console.log("--------- 🧪 TEST CR 🧪 ------------")
 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())


 await contract.start(acc6.address);
 console.log("👷 Started", ((await contract.allEmployee(acc6.address)).flowRate).toNumber())

 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())

 await contract.finish(acc6.address);
 console.log("👷 Finish")

 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())

 console.log("---- 🧪 TEST #2   ---")

 await contract.start(acc3.address);
 console.log("👷 Started", ((await contract.allEmployee(acc3.address)).flowRate).toNumber())
 await contract.start(acc1.address);
 console.log("👷#2 Started", ((await contract.allEmployee(acc1.address)).flowRate).toNumber())

 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())

 await contract.finish(acc3.address);
 await contract.finish(acc1.address);
 console.log("👷 Finish All")

 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄Stream [CR = common rate]: ", (await contract.CR()).toString())
 console.log("📄Stream [EFT = Enough funds till]: ", (await contract.EFT()).toString())


 console.log()
 console.log("---- 🧪🏧 TEST #1 Withdraw Employee  ---")
 console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
 console.log("📄 Check var (startAt): ", ((await contract.getStream(acc5.address)).startAt).toNumber())
 await contract.start(acc5.address);
 console.log("👷#5 Started", "📄 Check var (startAt): ", ((await contract.getStream(acc5.address)).startAt).toNumber())
 console.log("🌊 Employee #5 has: ", (await contract.currentBalanceEmployee(acc5.address)).toString())  

 const blockTimestamp12 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
 await ethers.provider.send("evm_mine", [blockTimestamp12 + 200]); // 
 console.log("⌛   Wait 200 sec ...")

 console.log("🟡Real Balance [Employee #5]: ", (await contractUSDT.balanceOf(acc5.address)).toNumber())
 console.log("🌊 Employee #5 has: ", (await contract.currentBalanceEmployee(acc5.address)).toString())  

await contract.connect(acc5).withdrawEmployee();
console.log("🏧👷#5 Withdraw")
console.log("📄 Check var (startAt): ", ((await contract.getStream(acc5.address)).startAt).toNumber())

console.log("🟡Real Balance [Employee #5]: ", (await contractUSDT.balanceOf(acc5.address)).toNumber())
console.log("🌊 Employee #5 has: ", (await contract.currentBalanceEmployee(acc5.address)).toString())  
console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())

const blockTimestamp13 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
await ethers.provider.send("evm_mine", [blockTimestamp13 + 100]); // 
console.log("⌛   Wait 100 sec ...")

console.log("🌊 Employee #5 has: ", (await contract.currentBalanceEmployee(acc5.address)).toString())
await contract.finish(acc5.address);
console.log("👷 Finish")
console.log("🟡Real Balance [Employee #5]: ", (await contractUSDT.balanceOf(acc5.address)).toNumber())

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
// console.log("📢 EVENTS")
// //const eventsAll = await contract.queryFilter("*" as any, 0,  (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;)
// const blockNumber = await ethers.provider.getBlockNumber();

// // Get all events from the contract from block 0 to the latest block
// const eventsAddEmployee = await contract.queryFilter(
//   contract.filters["AddEmployee(address,uint256)"](),
//   0,
//   blockNumber
// );
// console.log("Amount Evetns: ", eventsAddEmployee.length)


// const eventsStartStream = await contract.queryFilter(
//   contract.filters.StreamCreated(),
//   0,
//   blockNumber
// );

// console.log("Stream Created Evetns: ", eventsStartStream[0].args)

// // let eventFilterFinish = contract.filters["StreamFinished(address,uint256,uint256)"];
// // let eventsFinishStream = await contractFactory.queryFilter(eventFilterFinish);
// // console.log("📢 EVENTS FINISH: ", eventsFinishStream.length)


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


// ????????? CALCULATE token limit to add new Employee
// const totalAmountEmployees = (await contract.amountEmployee()).toNumber();
// const cRrate = (await contract.commonRateAllEmployee()).toNumber();
// const hoursLimit = (await contract.hoursLimitToAddNewEmployee()).toNumber();
// const res = (totalAmountEmployees + 1 ) * (cRrate + 10) * hoursLimit;
//     console.log(`📈 Calculation Math to add new employee:  ${totalAmountEmployees + 1} * ${cRrate + 10} * ${hoursLimit} = ${res} `)
// // ????????? CALCULATE token limit to Stream All 
//console.log("---------📈 BUFFER INFO 📈------------")
// const totalAmountEmployees2 = (await contract.amountEmployee()).toNumber();
// const cRrate2 = (await contract.commonRateAllEmployee()).toNumber();
// const hoursLimit2 = (await contract.hoursLimitToAddNewEmployee()).toNumber();
// const res2 = totalAmountEmployees2 * cRrate2 * hoursLimit2;

// const scBal2 = (await contract.balanceContract()).toNumber();
// console.log(`📈 Calculation Math to add new employee:  ${totalAmountEmployees2} * ${cRrate2} * ${hoursLimit2} = ${res2} `)
// console.log("📈Valid TO ADD // Balance: ", scBal2)
// console.log("📈 Can I add new Employee ", (scBal2 > res2))
// console.log("📈 Time different", (scBal2 - res2))