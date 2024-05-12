import hre, { ethers } from "hardhat";

const baseURI = "https://www.cliquecapital.io/payouts";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CliqueCapitalPayout = await ethers.deployContract(
    "CliqueCapitalPayout"
  );

  console.log(
    "CliqueCapitalPayout address:",
    await CliqueCapitalPayout.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
