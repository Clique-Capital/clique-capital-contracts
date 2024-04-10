import { expect } from "chai";
import hre from "hardhat";
import { parseEther, formatEther } from "viem";

// we need to break it up into 3 parts eventually, token, dao, token and dao
describe("Clique Coin and Clique Capital DAO", () => {
  let signers: Awaited<ReturnType<typeof hre.viem.getWalletClients>>;
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
    signers = await hre.viem.getWalletClients();

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

    publicClient = await hre.viem.getPublicClient();

    const positionManager = await hre.viem.getContractAt(
      "NonfungiblePositionManager",
      "0x1238536071e1c677a632429e3655c799b22cda52"
    );
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
