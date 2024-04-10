import { expect } from "chai";
import hre from "hardhat";
import { parseEther, formatEther } from "viem";

describe("MyToken contract", () => {
  let signers: Awaited<ReturnType<typeof hre.viem.getWalletClients>>;
  let publicClient: Awaited<ReturnType<typeof hre.viem.getPublicClient>>;

  let clqCoin: Awaited<
    ReturnType<typeof hre.viem.deployContract<"CliqueCoin">>
  >;
  const name = "CliqueCoin";
  const ticker = "CLQ";
  const premine = 10000000;
  const premineDestination: `0x${string}` =
    (process.env.PUBLIC_ADDRESS as `0x${string}`) ||
    (`0x${"0".repeat(40)}` as `0x${string}`);

  before(async () => {
    signers = await hre.viem.getWalletClients();

    clqCoin = await hre.viem.deployContract("CliqueCoin", [
      name,
      ticker,
      premine,
      premineDestination,
    ]);

    publicClient = await hre.viem.getPublicClient();
  });

  describe("Deployment", () => {
    it("Premine Distributed", async () => {
      const balance = (await clqCoin.read.balanceOf([
        premineDestination,
      ])) as bigint;
      const balanceInEther = formatEther(balance);
      const premineInEther = formatEther(parseEther(premine.toString()));

      expect(balanceInEther).to.equal(premineInEther);
    });
  });
});
