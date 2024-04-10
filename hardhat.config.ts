import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

require('@openzeppelin/hardhat-upgrades');

const { INFURA_API_KEY, MNEMONIC, REPORT_GAS } = process.env;

if (!INFURA_API_KEY || !MNEMONIC) {
  throw new Error("Please set your INFURA_API_KEY and MNEMONIC in a .env file");
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  ganache: 1337,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  sepolia: 11155111,
};

const config: HardhatUserConfig = {
  gasReporter: {
    currency: "USD",
    enabled: REPORT_GAS === "true",
    excludeContracts: [],
    src: "./contracts",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version:"0.8.24",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
      typechain: {
        outDir: "types",
        target: "ethers-v6",
      },
    },
  },

};

export default config;
