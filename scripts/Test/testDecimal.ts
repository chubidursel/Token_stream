import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testDecimal.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

// ----------------CONTRACTS---------------------

// #1 Deploy Stablecoin
const ContractUSDT = await ethers.getContractFactory("StableCoin");
const contractUSDT = await ContractUSDT.deploy();
await contractUSDT.deployed();

// #2 Deploy Company Implementaion
const Company = await ethers.getContractFactory("Company");
const companyIMPL = await Company.deploy()

// #3 Deploy Factory
 const Factory = await ethers.getContractFactory("CompanyFactory");
 const factory = await Factory.deploy(companyIMPL.address);
 await factory.deployed();

 console.log("🏭 Factory deployed", factory.address);
 console.log("🏭 Factory beacon", await factory.beacon());

// #4 Create new company and get its address
 await factory.createCompany("Tesla")

   let eventFilter = factory.filters.Creation();
   let events = await factory.queryFilter(eventFilter);
   const addressCompany = events[0]?.args[0]
  
   const contract = companyIMPL.attach(
    addressCompany
  );

  console.log("🆕 New Contract Company: ", addressCompany)

 
  console.log("✅ All Contracts has been deployed!")

  // ------------------ TX_COMPANY_SETTING ------------------  


  const tokensToMint = ethers.utils.parseEther("10000.0")
  const employeeRate = ethers.utils.parseEther("0.1")


    const tx = await contract.setToken(contractUSDT.address);
    console.log("✅ Token_set")

  const txCoin = await contractUSDT.mint(contract.address, tokensToMint)
  console.log("✅🟡 Transfer token done! 1000$")
  await txCoin.wait()

    await contract.addEmployee(acc1.address, employeeRate); // calculation of rate grab from Front
    console.log("✅ Emplployee #1 added")

 // ------------------ TX_COMPANY_OPERATION ------------------ 
 console.log()
 console.log("💥💥💥💥 STREAMING #1 STARTED 💥💥💥💥 ")

 console.log(`📈 [SOL#1] Token Limit to Start 1 STREAM:  ${ethers.utils.formatEther((await contract.getTokenLimitToStreamOne(acc1.address)))}`)
 console.log("📈 [SOL#1] Balance - Limit = ", ((Number((await contract.balanceContract()).toString()) - Number((await contract.getTokenLimitToStreamOne(acc1.address)).toString())) /1000000000000000000 )   )
 
   const tx5 = await contract.start(acc1.address);
  console.log("👷 Emplployee #1 Came to Work || GasPrice: ", tx5.gasPrice?.toString())

  // console.log("Stream info about employee: ", await contract.getStream(acc1.address))

  //----------- FUNC FROM StreamLogic ------------
 
    console.log("---------STREAM INFO ------------")
    console.log("📄Stream [Amount Stream]: ", (await contract.amountActiveStreams()).toString())
    console.log("📄Stream [CR = common rate]: ", ethers.utils.formatEther((await contract.CR())))
    console.log("📄Stream [EFT = Enough funds till]: ", (ethers.utils.formatEther(await contract.EFT())))
    console.log("-------------------------")



  
    console.log("-------BALANCE CHECK-------")
    console.log("🌊 Employee #1 has: ", (ethers.utils.formatEther(await contract.currentBalanceEmployee(acc1.address)))) 
    console.log("🌊 SC has: ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
    console.log("🟡Real Balance [Employee #1]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc1.address))))
    console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
    console.log("----------------")

  // SKIP BLOCKS
    const blockTimestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    await ethers.provider.send("evm_mine", [blockTimestamp + 10]); // <- 10 sec
    console.log("Wait 10 sec ...")


    console.log("🌊 Employee #1 has: ", (ethers.utils.formatEther(await contract.currentBalanceEmployee(acc1.address)))) 
    console.log("🌊 SC has: ", (ethers.utils.formatEther(await contract.currentBalanceContract())))

    // SKIP BLOCKS
    const blockTimestamp2 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    await ethers.provider.send("evm_mine", [blockTimestamp2 + 20]); // <- 10 sec
    console.log("Wait 20 sec ...")

    console.log("🌊 Employee #1 has: ", (ethers.utils.formatEther(await contract.currentBalanceEmployee(acc1.address)))) 
    console.log("🌊 SC has: ", (ethers.utils.formatEther(await contract.currentBalanceContract())))

  // const employInfo = await contract.allEmployee(acc1.address)
  // console.log("Employee info from company Contract: ", employInfo)

  const employStream = await contract.getStream(acc1.address)
  console.log("Stream info about employee: ", employStream.active)

  const tx6 = await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left || GasPrice: ", tx6.gasPrice?.toString())
  console.log("🏁 STREAMING #1 FINISHED 🏁 ")

  console.log("🟡Real Balance [Employee #1]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc1.address))))
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))


  console.log()
  console.log("💥💥💥💥 STREAMING #2 REAL HOURS 💥💥💥💥 ")
  // Employee makes 10$/hour and worked 8 hours == 80$
  // eaqual to 0.0027 $/h
  const tokenProsec = 10 / 60 / 60
  // console.log("💥tokenProsec ", tokenProsec.toFixed(6)) 
  const employeeRate2 = ethers.utils.parseEther(tokenProsec.toFixed(6))

  const tx11 = await contract.addEmployee(acc2.address, employeeRate2); // calculation of rate grab from Front
  console.log("✅ Emplployee #2 added || RATE SET IS: ", (ethers.utils.formatEther((await contract.allEmployee(acc2.address)).flowRate)), "🧮 === 10$ /60 /60")
  console.log("PS:  REAL RATE SET IS: ", (((await contract.allEmployee(acc2.address)).flowRate)).toString())

  console.log(`📈 Token Limit to Start 1 STREAM:  ${ethers.utils.formatEther((await contract.getTokenLimitToStreamOne(acc2.address)))}`)

  console.log("🟡Real Balance [Employee #2]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc2.address))))


  await contract.start(acc2.address);
  console.log("👷 Emplployee #2 Came to Work ")


    const blockTimestamp4 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
    await ethers.provider.send("evm_mine", [blockTimestamp4 + 28800]); // <- 10 sec
    console.log("Wait 8h ...")

  await contract.finish(acc2.address);
  console.log("👷 Emplployee #2 Left")

  console.log("🟡Real Balance [Employee #2]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc2.address))))
  console.log("🟡PS:   Real Balance [Employee #2]: ", ((await contractUSDT.balanceOf(acc2.address))).toString())
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))


  console.log()
  console.log("💥💥💥💥 STREAMING #3 OUTSOURCE 💥💥💥💥 ")

  console.log("🟡PS:   Real Balance [Freelancer #6]: ", ((await contractUSDT.balanceOf(acc6.address))).toString())
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))

  await contract.createOutsourceJob(acc6.address, "create WEBsite", ethers.utils.parseEther("10"), 100, 0);
  console.log("👷 FREELANCER #6 ")

  const idd = (await contract.OutsourceID()).sub(1)

  const data1 = await contract.listOutsource(idd);
  // console.log(data1)

  await ethers.provider.send("evm_mine", [(await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + 20]); // <- 10 sec
  console.log("Wait 20 sec ...")

  await contract.connect(acc6).withdrawFreelancer(idd);

  console.log("👷 FREELANCER #6 WITHDRAW ")
  console.log("🟡Freelancer #6]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc6.address))))
  console.log("🟡PS:   Real Balance [Freelancer #6]: ", ((await contractUSDT.balanceOf(acc6.address))).toString())
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))


  await contract.connect(acc6).claimFinish(idd, "www.favebook.com");
  console.log("👷 FREELANCER #6 CLAIMED ")

  await contract.finishOutsource(idd)
  console.log("👷 FREELANCER #6 FINSIHED ")
  console.log("🟡Freelancer #6]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc6.address))))
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))


  console.log()
  console.log("---------------------- 🧪 TEST #1 Balance Virtua/OverRride  -------------------------")
  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log("🟡BALANCE_WITH_LOCKED [Company SC]: ", (ethers.utils.formatEther(await contract.avalibleBalanceContract())))

  await contract.createOutsourceJob(acc6.address, "create WEBsite", ethers.utils.parseEther("100"), 200, 0);
  console.log("👷 FREELANCER #6 ")

  console.log("🟡Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log("🟡BALANCE_WITH_LOCKED [Company SC]: ", (ethers.utils.formatEther(await contract.avalibleBalanceContract())))


  console.log()
  console.log("💥💥💥💥 STREAMING #5  💥💥💥💥 ")



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