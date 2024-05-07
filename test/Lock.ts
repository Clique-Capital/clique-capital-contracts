import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { parseEther, formatEther } from "viem";
import NonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { Pool, computePoolAddress } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";

const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  "0x6b2937Bde17889EDCf8fbD8dE31C3C2a70Bc4d65";

const UniswapV3Factory_ADDRESS = "0x248AB79Bbb9bC29bB72f7Cd42F17e054Fc40188e";

// we need to break it up into 3 parts eventually, token, dao, token and dao
describe("Clique Coin and Clique Capital DAO", () => {
  let walletClients: Awaited<ReturnType<typeof hre.viem.getWalletClients>>;
  let signers: Awaited<ReturnType<typeof hre.ethers.getSigners>>;
  let publicClient: Awaited<ReturnType<typeof hre.viem.getPublicClient>>;

  let clqCoin: Awaited<
    ReturnType<typeof hre.viem.deployContract<"CliqueCoin">>
  >;
  let clqDao: Awaited<
    ReturnType<typeof hre.viem.deployContract<"CliqueCapitalDAO">>
  >;
  let tether: Awaited<ReturnType<typeof hre.viem.getContractAt<"Tether">>>;

  const cliqueCoinArgs = [
    "CliqueCoin",
    "CLQ",
    10000000,
    (process.env.PUBLIC_ADDRESS as `0x${string}`) ||
      (`0x${"0".repeat(40)}` as `0x${string}`),
  ] as const;

  before(async () => {
    walletClients = await hre.viem.getWalletClients();
    signers = await hre.ethers.getSigners();

    clqCoin = await hre.viem.deployContract("CliqueCoin", [...cliqueCoinArgs]);

    tether = await hre.viem.deployContract("Tether");

    const cliqueDaoArgs = [
      clqCoin.address,
      "Clique Capital DAO",
      1,
      1,
      1,
      1,
    ] as const;
    clqDao = await hre.viem.deployContract("CliqueCapitalDAO", [
      ...cliqueDaoArgs,
    ]);

    // Create pool
    // const nonfungiblePositionManager = await hre.ethers.getContractAt(
    //   NonfungiblePositionManager.contractName,
    //   nonfungiblePositionManagerAddress
    // );
    // console.log("Creating pool", nonfungiblePositionManager);
    const contract = await hre.ethers.getContractAt(
      NonfungiblePositionManager.abi,
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS
    );

    const token1Approval = await tether.write.approve([
      process.env.PUBLIC_ADDRESS,
      parseEther("100"),
    ]);
    const token0Approval = await clqCoin.write.approve([
      process.env.PUBLIC_ADDRESS,
      parseEther("100"),
    ]);
    const chain = await hre.ethers.provider.getNetwork();

    const clqCoinToken: Token = new Token(
      Number(chain.chainId),
      clqCoin.address,
      18,
      "Clique Coin",
      "CLQ"
    );
    const tetherToken: Token = new Token(
      Number(chain.chainId),
      tether.address,
      18,
      "Tether",
      "USDT"
    );

    const poolAddress = computePoolAddress({
      factoryAddress: UniswapV3Factory_ADDRESS,
      tokenA: clqCoinToken,
      tokenB: tetherToken,
      fee: 3000,
    });
    const fee = 3000;
    const sqrtRatioX96 = 0;
    const liquidity = 1000;
    const tick = 0;
    const pool = new Pool(clqCoinToken, tetherToken, fee,sqrtRatioX96, liquidity, tick);
 
    

    // Note that the pool defined by DAI/USDC and fee tier 0.3% must already be created and initialized in order to mint
    
  });

  describe("Test Deployment", () => {
    it("Clique Coin Deployed", async () => {
      expect(clqCoin.address).to.not.be.undefined;
    });

    it("Clique Capital DAO Deployed", async () => {
      expect(clqDao.address).to.not.be.undefined;
    });

    it("Clique Coin Premine Distributed", async () => {
      const balance = (await clqCoin.read.balanceOf([
        cliqueCoinArgs[3],
      ])) as bigint;
      const balanceInEther = formatEther(balance);
      const premineInEther = formatEther(
        parseEther(cliqueCoinArgs[2].toString())
      );

      expect(balanceInEther).to.equal(premineInEther);
    });

    // Create a liquidity pool
    it("Create a Liquidity Pool", async () => {});
  });
});
