const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
require("dotenv").config()

//to run this script:
//1) Make sure you've created your own .env file
//2) Make sure that you have your network specified in hardhat.config.js
//3) run: npx hardhat run scripts/deploy.js --network goerli
async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    const provider = new hre.ethers.providers.JsonRpcProvider(
        `https://goerli.infura.io/v3/${process.env.INFURA_RINKEBY}`
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    console.log("Straing.....")

    console.log("Chain ID: ", (await provider.getNetwork()).chainId)

    const signers = await hre.ethers.getSigners()
    // We get the contract to deploy
    const MoneyRouter = await hre.ethers.getContractFactory("MoneyRouter")
    //deploy the money router account using the proper host address and the address of the first signer
    const moneyRouter = await MoneyRouter.deploy(
        sf.settings.config.hostAddress,
        signers[0].address
    )

    await moneyRouter.deployed()

    console.log("MoneyRouter deployed to:", moneyRouter.address)
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
