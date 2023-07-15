import { ethers } from "hardhat";

// npx hardhat run --network siberium scripts/deployUSDT.ts

async function main() {
  console.log("Starting Deploying....")

  const provider = ethers.provider;

  const [deployer] = await ethers.getSigners();

  console.log("Deployer: ", deployer.address)

  const Contract = await ethers.getContractFactory("StableCoin");
  

  // const estimateGas = await provider.estimateGas({data: Contract.bytecode});
  // console.log("Contract to deploy gas limit? : ", estimateGas)
  const priceGas = await provider.getGasPrice()
  const contract = await Contract.deploy(
    {
      gasLimit: 5000000,
      gasPrice: priceGas
    }
  );
  console.log("GasPrice: ", priceGas)
  console.log("Contract to deploy: ", contract)
  const res = await contract.deployed();

  console.log(res)

  console.log("👨 The owner of smart contract is: ", deployer.address);
  console.log(`🔥 SC Deployed! Address: ${contract.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});