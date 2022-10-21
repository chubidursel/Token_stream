import { expect } from "chai";
import {ethers} from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";



describe("Storage contract", function () {
  async function deploy(){
    const [ deployer, user ] = await ethers.getSigners();
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

    return { storage, deployer, user }
  }
  it('Should deploy the contract and check the owner', async function() {
    //how to deploy smart contract here???
    const { storage, deployer } = await loadFixture(deploy)
    expect(await storage.owner()).to.eq(deployer.address);
  });
   it('transfers ownership', async function() {
  // test ownership transfer
  const { storage, user } = await loadFixture(deploy)
    const tx = await storage.transferOwnership(user.address);
    await tx.wait();
    expect(await storage.owner()).to.eq(user.address);
  });

  // it("Check receive function", async function() {
  //   const { storage, deployer } = await loadFixture(deploy)

  //   const txData = {to: storage.address, value: 100000};
  //   const tx = await deployer.sendTransaction(txData);
  //   await tx.wait();
  
  //   expect(await storage.getBalance()).to.eq(100000);
    
  //   await expect(tx).to.changeBalances([deployer, storage], [-100000, 100000]);
  // });
});

  
// it("Not owner", async function() {
//   const { storage, user } = await loadFixture(deploy)
//   const txNoOwner = storage.connect(user).transferOwnership(user);
//  expect(txNoOwner).to.be.reverted;
// });
  

  

  
  // it("Sets value", async function(){
  //   const setNum = await storage.store(21);
  //   await setNum.wait();
  
  //   expect(await storage.myVal()).to.eq(21);
  
  //   await expect(setNum)
  //   .to.emit(storage, 'Stored')
  //   .withArgs(21);
  // });
  
  // // hash:
  // // ethers.utils.solidityKeccak256(['address', 'string'], [deployer.address, 'test']) --> bytes32
  // // keccak256(abi.encodePacked(deployer.address, "test")) -- solidity
  // it(
  //   "CommitVote",
  //   async function(){ 
  //     const bytes = ethers.utils.defaultAbiCoder.encode(['address'], [deployer.address]);
  //     const set = await storage.commitVote(bytes);
  //     expect(await storage.commits(deployer.address)).to.eq(bytes);
  //   }
  // );