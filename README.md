# Flowary app

This app is build to bring real comapny into Blockchain

### Overview
1. Users can create new Company via Factory contract
2. Owner of comapny has to set token as a payment (i.e USDT)
3. Deposit some funds to pay salaries to employees
4. Add new employee with wage (amount of token pro sec)
5. Start stream to this employee
    while active stream employee can withdraw as much funds as he earned
6. Finish stream when employee finish his work

### Also this protocl provides Outsource stream

* Nice features you can find in:
Check out command.txt

## VERSION V3
- Company Implementation -> 0xB8c683CcAa269932f179641B36582710a7Db4c1a
- Factory -> 0x0ea62B158B5c5995a0864331e286e9FC0a207A33
- Beacon -> 0x3e7003c91C36a216C158cf6e14A10f7c9441825a


## Installation

Install the dependencies and devDependencies and intereact with your own smart contract.

```sh
git clone
cd Flowary
npm i
npx hardhat compile
TEST: npx hardhat run scripts/Test/testLiqudation.ts
DEPLOY: npx hardhat run --network goerli scripts/deployCompany.ts
```
