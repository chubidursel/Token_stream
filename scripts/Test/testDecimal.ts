import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testDecimal.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

// ----------------CONTRACTS---------------------
  const Contract = await ethers.getContractFactory("Company");
  //const contract = await Contract.deploy("RogaAndKopita", deployer.address); // << DEPLOY CONTRACT FROM FACTORY

  const ContractUSDT = await ethers.getContractFactory("StableCoin");
  const contractUSDT = await ContractUSDT.deploy();

  const ContractFactory = await ethers.getContractFactory("CompanyFactory");
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

  // const tokenToMint = ethers.BigNumber.from("1000000000000000000000") // TO STRING?
  // console.log("!!!!!!!!!!!!!!!!", tokenToMint)

  const tokensToMint = ethers.utils.parseEther("10000.0")
  const employeeRate = ethers.utils.parseEther("0.1")
  //  ethers.utils.formatUnits

  console.log("!!!!!!!!!!!!@@@@@@@", BigInt(100))

    const tx = await contract.setToken(contractUSDT.address);
    console.log("✅ Token_set|| GasPrice: ", tx.gasPrice?.toString())

  const txCoin = await contractUSDT.mint(contract.address, tokensToMint)
  console.log("✅🟡 Transfer token done! || GasPrice: ", txCoin.gasPrice?.toString())
  await txCoin.wait()

    const tx3 = await contract.addEmployee(acc1.address, employeeRate); // calculation of rate grab from Front
    console.log("✅ Emplployee #1 added|| GasPrice: ", tx3.gasPrice?.toString())

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