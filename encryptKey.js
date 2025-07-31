const { ethers } = require("ethers");
const fs = require("fs");
require('dotenv').config();

const pvt = process.env.PRIVATE_KEY;

async function main() {
  const wallet = new ethers.Wallet(pvt);

  const encryptedJson = await wallet.encrypt("password");

  console.log("Encrypted JSON (keystore):", encryptedJson);
  fs.writeFileSync("encryptedKey.json", encryptedJson);
  console.log("Encrypted key written to encryptedKey.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("An error occurred:", error); // More descriptive error message
    process.exit(1);
  });
