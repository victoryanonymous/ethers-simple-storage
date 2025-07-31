const { ethers } = require("ethers")
const fs = require("fs")
require("dotenv").config();

const url = process.env.SEPOLIA_URL || "http://127.0.0.1:7545"
const pvt = process.env.PRIVATE_KEY || ""
async function main() {
    const provider = new ethers.JsonRpcProvider(url)
    const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf8")
    let wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedJson, "password")
    wallet = await wallet.connect(provider)
    console.log("wallet", wallet)
    const abi = fs.readFileSync("./SimplePoll_sol_SimplePoll.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimplePoll_sol_SimplePoll.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying contract please wait...")
    const contract = await contractFactory.deploy()
    console.log("Contract deployed to:", contract)
    await contract.deploymentTransaction().wait(1)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
