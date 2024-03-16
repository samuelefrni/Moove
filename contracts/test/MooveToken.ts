import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MooveToken", () => {
  async function deploy() {
    const tokenName = "MooveToken";
    const tokenSymbol = "MT";
    const [owner, otherAccount] = await ethers.getSigners();
    const MooveToken = await ethers.deployContract("MooveToken", [
      tokenName,
      tokenSymbol,
    ]);

    return { tokenName, tokenSymbol, owner, otherAccount, MooveToken };
  }
  describe("Testing general info about ERC721 token", () => {
    it("Should return the correct token name and symbol", async () => {
      const { tokenName, tokenSymbol, MooveToken } = await loadFixture(deploy);

      expect(await MooveToken.name()).to.equal(tokenName);
      expect(await MooveToken.symbol()).to.equal(tokenSymbol);
    });
  });
  describe("Testing addVehicle function", () => {
    it("Should revert if the sender is not the Owner", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await expect(
        MooveToken.connect(otherAccount).addVehicle(
          12345,
          "Bike",
          "Electric",
          ethers.parseEther("0.1")
        )
      ).to.be.reverted;
    });
    it("Should add the vehicle and generete the ERC721 token", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      expect(await MooveToken.availableVehicle(12345)).to.equal(true);
      expect(await MooveToken.detailsVehicle(12345)).to.deep.equal([
        BigInt(12345),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        true,
        await MooveToken.getAddress(),
      ]);
      expect(
        await MooveToken.balanceOf(await MooveToken.getAddress())
      ).to.equal(1);
    });
  });
});
