# Ethers Simple Storage

A simple Ethereum smart contract project using Ethers.js for deployment and interaction.

## Project Overview

This project demonstrates a basic Ethereum smart contract deployment and interaction using Ethers.js. It includes:

-   Contract compilation using solc
-   Deployment scripts
-   Environment configuration
-   Contract interaction capabilities

## Prerequisites

-   Node.js (v16 or higher)
-   Yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/victoryanonymous/ethers-simple-storage.git
```

```bash
cd ethers-simple-storage
```

2. Install dependencies:

```bash
yarn install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY="your_private_key_here"
```

## Usage

### Compile Contract

Compile the Solidity contract:

```bash
yarn compile
```

This will generate the following files:

-   ABI file
-   Bytecode file
-   Standard JSON input and output files

### Deploy Contract

Deploy the contract to Sepolia testnet:

```bash
node deploy.js
```

The deployment script will:

1. Connect to the Sepolia network using the provided URL
2. Load the encrypted private key
3. Deploy the contract
4. Output the contract address

## Project Structure

-   `/contracts`: Smart contracts
-   `compile.js`: Contract compilation script
-   `deploy.js`: Deployment script
-   `encryptedKey.json`: Encrypted private key
-   `package.json`: Project dependencies
-   `.env`: Environment variables

## Dependencies

-   ethers: ^6.15.0
-   fs-extra: ^11.3.0
-   solc: ^0.8.30
-   dotenv: ^17.2.1

## License

MIT
