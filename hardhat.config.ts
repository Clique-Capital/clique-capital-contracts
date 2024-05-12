import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-ethers";
dotEnvConfig();

const {
  INFURA_API_KEY,
  REPORT_GAS,
  INFURA_ARBITRUM_SEPOLIA_ENDPOINT,
  PRIVATE_KEY,
  PUBLIC_ADDRESS,
} = process.env;
if (!INFURA_API_KEY) throw new Error("INFURA_API_KEY is not set");
if (!REPORT_GAS) throw new Error("REPORT_GAS is not set");
if (!INFURA_ARBITRUM_SEPOLIA_ENDPOINT)
  throw new Error("INFURA_ARBITRUM_SEPOLIA_ENDPOINT is not set");
if (!PRIVATE_KEY) throw new Error("ARBITRUM_SEPOLIA_PRIVATE_KEY is not set");
if (!PUBLIC_ADDRESS) throw new Error("PUBLIC_ADDRESS is not set");

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: INFURA_ARBITRUM_SEPOLIA_ENDPOINT,
        blockNumber: 5665622,
      },
    },
    arbitrum_sepolia: {
      url: INFURA_ARBITRUM_SEPOLIA_ENDPOINT,
      accounts: [PRIVATE_KEY],
    },
  },
  defaultNetwork: "arbitrum_sepolia",
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.24",
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
    },
  },
};

export default config;
