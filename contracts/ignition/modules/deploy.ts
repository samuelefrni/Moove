import { ethers } from "hardhat";

async function main() {
  const nameToken = "MooveToken";
  const symbolToken = "MT";
  const [owner] = await ethers.getSigners();

  const VehicleAuctions = await ethers.deployContract("VehicleAuctions", [
    nameToken,
    symbolToken,
  ]);

  VehicleAuctions.waitForDeployment();

  console.log(`Deployed with ${owner.address}`);
  console.log(`Deployed at: ${await VehicleAuctions.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
