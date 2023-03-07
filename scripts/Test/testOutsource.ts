import { ethers, upgrades } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/Test/testOutsource.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

// ----------------CONTRACTS---------------------

   // ------------ #1 DEPLOY LIB--------------------
   const Lib = await ethers.getContractFactory("ArrayLib");
   const lib = await Lib.deploy();

   console.log("LIBRARY IS DONE: ", lib.address)

   // ------------ #2 DEPLOY COMPANY IMPL--------------------
   const CompanyImpl = await ethers.getContractFactory("Company");
   const Bcn = await ethers.getContractFactory("CompanyBeacon");
  //  const companyImpl = await CompanyImpl.deploy();
 
  //  console.log("COMPANY IMPLEMENTATION IS DONE: ", companyImpl.address)


// ------------ #???  DEPLOY BEACON--------------------
const Beacon = await upgrades.deployBeacon(CompanyImpl);
const beacon = await Beacon.deployed();
console.log("BEACON: ", beacon.address)


   // ------------ #4 DEPLOY FACTORY--------------------
   const Factory = await ethers.getContractFactory("CompanyFactory");
   const factory = await Factory.deploy(beacon.address);

   console.log("FACTORY IS DONE: ", factory.address)


 // ----------------#5 deploy USDT  ---------------------

   const ContractUSDT = await ethers.getContractFactory("StableCoin");
   const contractUSDT = await ContractUSDT.deploy();
 
   console.log("USDT IS DONE: ", contractUSDT.address)

   // ------------------ TX_COMPANY_SETTING ------------------
   const txF = await factory.createCompany("Apple");
   await txF.wait()
   console.log("🏭 Creating new Contract")

   let eventFilter = factory.filters.Creation();
   let events = await factory.queryFilter(eventFilter);
   const addressCompany = events[0]?.args[0]
   
// SETTING NEW CONTRACT FROM FACTORY
  const Contract = await ethers.getContractFactory("Company", {
    libraries: {
      ArrayLib: lib.address
    }});
   const contract = Contract.attach(
    addressCompany
  );

  console.log("🆕 New Contract Company: ", addressCompany)

 
  console.log("✅ All Contracts has been deployed!")

  // ------------------ TX_COMPANY_SETTING ------------------  

  // const tokenToMint = ethers.BigNumber.from("1000000000000000000000") // TO STRING?
  // console.log("!!!!!!!!!!!!!!!!", tokenToMint)
  // console.log("!!!!!!!!!!!!@@@@@@@", BigInt(100))

  const tokensToMint = ethers.utils.parseEther("10000.0")
  const employeeRate = ethers.utils.parseEther("0.1")


    const tx = await contract.setToken(contractUSDT.address);
    console.log("✅ Token_set|| GasPrice: ", tx.gasPrice?.toString())

  const txCoin = await contractUSDT.mint(contract.address, tokensToMint)
  console.log("✅🟡 Transfer token done! || GasPrice: ", txCoin.gasPrice?.toString())
  await txCoin.wait()

    await contract.addEmployee(acc1.address, employeeRate); 
    await contract.addEmployee(acc2.address, employeeRate); 
    console.log("✅ Emplployee #1 and 2 added||")


 console.log()
 console.log("💥💥💥💥 TEST #1  (avalibleBalanceContract) 💥💥💥💥 ")

 console.log("-------BALANCE CHECK-------")
 console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
 console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
 console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
 console.log("----------------")


 console.log("📄Outsource ID: ", (await contract.OutsourceID()).toString())

 // PARAM 
 const who = acc3.address
 const task = "Create Site"
 const wage = ethers.utils.parseEther("10")
 const deadline = 100;
 const buffer = 0


  const txOutSource = await contract.createOutsourceJob(who, task, wage, deadline, buffer)
  const resTx = await txOutSource.wait()
  const gasPrice = await deployer.getGasPrice()
  const amountOfEthToPay = gasPrice.mul(resTx.gasUsed)
  console.log("👨 Account3 Create OutSource Task ||  ⛽ GAS (ETH paid)", ethers.utils.formatUnits(amountOfEthToPay, "ether"))


  console.log("📄Outsource ID: ", (await contract.OutsourceID()).toString())


  console.log("-------BALANCE CHECK-------")
  console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
  console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
  console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log("----------------")

  await contract.start(acc1.address);
  console.log("👷 Emoloyee #1 start STREAMING")


  const blockTimestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp + 777]); // <- 10 sec
  console.log("Wait 100 sec ...")

  console.log("-------BALANCE CHECK-------")
  console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
  console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
  console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log()
  console.log("🟡Real Balance [Employee #3]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc3.address))))
  console.log("🟡Real Balance [Employee #1]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc1.address))))
  console.log("----------------")


  await contract.finish(acc1.address);
  console.log("👷 Emplployee #1 Left")

  console.log("-------BALANCE CHECK-------")
  console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
  console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
  console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log()
  console.log("🟡Real Balance [Employee #3]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc3.address))))
  console.log("🟡Real Balance [Employee #1]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc1.address))))
  console.log("----------------")


  await contract.finishOutsource(0)
  console.log("👨 TASK IS OVER #1")

  console.log("-------BALANCE CHECK-------")
  console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
  console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
  console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
  console.log()
  console.log("🟡Real Balance [Employee #3]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc3.address))))
  console.log("🟡Real Balance [Employee #1]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc1.address))))
  console.log("----------------")


  console.log()
  console.log("💥💥💥💥 TEST #2  (BUFFER) 💥💥💥💥 ")
  await contract.withdrawTokens();
  await contractUSDT.mint(contract.address, tokensToMint)


  const who2 = acc4.address
  const task2 = "Create Site"
  const wage2 = ethers.utils.parseEther("100")
  const deadline2 = 100;
  const buffer2 = 50
 
 
   const txOutSource2 = await contract.createOutsourceJob(who2, task2, wage2, deadline2, buffer2)
   const resTx2 = await txOutSource2.wait()
   const gasPrice2 = await deployer.getGasPrice()
   const amountOfEthToPay2 = gasPrice2.mul(resTx2.gasUsed)
   console.log("👨 Account4 Create OutSource Task (100$)||  ⛽ GAS (ETH paid)", ethers.utils.formatUnits(amountOfEthToPay2, "ether"))


   console.log("-------BALANCE CHECK-------")
   console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
   console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
   console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
   console.log()
   console.log("🟡Real Balance [Employee #4]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc4.address))))
   console.log("----------------")


// 100 / 2  = 50 total => 25sec is 25% => 50 - 25% =~ 13$
   await ethers.provider.send("evm_mine", [((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) + 25]); 
   console.log("Wait 25 sec ...")


   await contract.connect(acc4).withdrawFreelancer(1);
   console.log("👨 Account4 withdraw #1 <<<< ")

   console.log("-------BALANCE CHECK-------")
   console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
   console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
   console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
   console.log()
   console.log("🟡Real Balance [Employee #4]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc4.address))))
   console.log("----------------")
// ---------------- WITHDRAW #2----------------------
   await ethers.provider.send("evm_mine", [((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) + 75]); 
   console.log("Wait 75 sec ...")
   await contract.connect(acc4).withdrawFreelancer(1);
   console.log("👨 Account4 withdraw #2 <<< ")
   console.log("🟡Real Balance [Employee #4]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc4.address))))

// ---------------- WITHDRAW #3----------------------
// await ethers.provider.send("evm_mine", [((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) + 25]); 
// console.log("Wait 25 sec ...")

//    console.log("!!!!!!!!!!!!!!!", await contract.currentBal(1))
//    console.log("!!!!!!!!!!!!!!!", await contract.listOutsource(1))

//    await ethers.provider.send("evm_mine", [((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp) + 100]); 
//    console.log("Wait 100 sec ...")
//    await contract.connect(acc4).withdrawFreelancer(1);
//    console.log("👨 Account4 withdraw! ")
//    console.log("🟡Real Balance [Employee #4]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc4.address))))


   await contract.finishOutsource(1)
   console.log("👨 TASK IS OVER #ACC4")


   console.log("-------BALANCE CHECK-------")
   console.log("🌊 avalibleBalanceContract (): ", (ethers.utils.formatEther(await contract.avalibleBalanceContract()))) 
   console.log("🌊 currentBalanceContract (): ", (ethers.utils.formatEther(await contract.currentBalanceContract())))
   console.log("🟡 Real Balance [Company SC]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(addressCompany))))
   console.log()
   console.log("🟡Real Balance [Employee #4]: ", (ethers.utils.formatEther(await contractUSDT.balanceOf(acc4.address))))
   console.log("----------------")

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