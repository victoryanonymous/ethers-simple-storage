const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const CONTRACT_NAME = "SimplePoll.sol";
const OUTPUT_DIR = path.resolve(__dirname, ".");

const EVM_VERSION = "prague";
const OPTIMIZER_ENABLED = true;
const OPTIMIZER_RUNS = 200;

const contractPath = path.resolve(__dirname, CONTRACT_NAME);
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    [CONTRACT_NAME]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": [
          "abi",
          "evm.bytecode.object",
          "evm.deployedBytecode.object",
          "metadata",
        ],
      },
    },
    optimizer: {
      enabled: OPTIMIZER_ENABLED,
      runs: OPTIMIZER_RUNS,
    },
    evmVersion: EVM_VERSION,
  },
};

console.log("Compiling contract...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const compilationErrors = output.errors.filter(
    (err) => err.severity === "error"
  );
  if (compilationErrors.length > 0) {
    compilationErrors.forEach((err) => {
      console.error(err.formattedMessage);
    });
    process.exit(1);
  } else {
    output.errors.forEach((err) => {
      console.warn(err.formattedMessage);
    });
  }
}

if (
  !output.contracts ||
  !output.contracts[CONTRACT_NAME] ||
  !output.contracts[CONTRACT_NAME].SimplePoll
) {
  console.error(
    "Error: Contract 'SimplePoll' not found in compilation output."
  );
  console.error(
    "Available contracts:",
    Object.keys(output.contracts[CONTRACT_NAME] || {})
  );
  process.exit(1);
}

const contract = output.contracts[CONTRACT_NAME].SimplePoll;

fs.ensureDirSync(OUTPUT_DIR);

const abiPath = path.resolve(OUTPUT_DIR, "SimplePoll_sol_SimplePoll.abi");
fs.writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2), "utf8");
console.log(`ABI written to ${abiPath}`);

const bytecodePath = path.resolve(
  OUTPUT_DIR,
  "SimplePoll_sol_SimplePoll.bin"
);
fs.writeFileSync(bytecodePath, contract.evm.bytecode.object, "utf8");
console.log(`Bytecode written to ${bytecodePath}`);

const inputJsonPath = path.resolve(OUTPUT_DIR, "SimplePoll_sol_Input.json");
fs.writeFileSync(inputJsonPath, JSON.stringify(input, null, 2), "utf8");
console.log(`Standard JSON Input written to ${inputJsonPath}`);

const outputJsonPath = path.resolve(
  OUTPUT_DIR,
  "SimplePoll_sol_Output.json"
);
fs.writeFileSync(outputJsonPath, JSON.stringify(output, null, 2), "utf8");
console.log(`Standard JSON Output written to ${outputJsonPath}`);

console.log("Compilation complete!");
