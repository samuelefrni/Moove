import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MooveToken", () => {
  async function deploy() {
    const tokenName = "MooveToken";
    const tokenSymbol = "MT";
    const [owner, otherAccount, otherAccount3] = await ethers.getSigners();
    const MooveToken = await ethers.deployContract("MooveToken", [
      tokenName,
      tokenSymbol,
    ]);

    return {
      tokenName,
      tokenSymbol,
      owner,
      otherAccount,
      otherAccount3,
      MooveToken,
    };
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
      const { owner, MooveToken } = await loadFixture(deploy);

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
        owner.address,
      ]);
      expect(await MooveToken.balanceOf(owner.address)).to.equal(1);
      expect(await MooveToken.allVehicle(0)).to.equal(12345);
    });
  });
  describe("Testing addVehicleAuctions function", () => {
    it("Should revert if the sender is not the Owner", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await expect(
        MooveToken.connect(otherAccount).addVehicleAuctions(
          12345,
          "Bike",
          "Electric",
          ethers.parseEther("0.1")
        )
      ).to.be.reverted;
    });
    it("Should add the vehicle and generete the ERC721 token", async () => {
      const { owner, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions(
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
        owner.address,
      ]);
      expect(await MooveToken.balanceOf(owner.address)).to.equal(1);
      expect(await MooveToken.auctionsVehicles(0)).to.equal(12345);
    });
  });
  describe("Testing buyNFTVehicle function", () => {
    it("Should revert if the vehicle doesn't exist", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await expect(MooveToken.buyNFTVehicle(12345)).to.revertedWith(
        "Vehicle doesn't found"
      );
    });
    it("Should revert if the sender doesn't have enough funds", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await expect(MooveToken.buyNFTVehicle(12345)).to.revertedWith(
        "Doesn't have enough funds to buy this vehicle"
      );
    });
    it("Should revert if the NFT has already been taken from another user", async () => {
      const { otherAccount, otherAccount3, MooveToken } = await loadFixture(
        deploy
      );

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await MooveToken.connect(otherAccount).buyNFTVehicle(12345, {
        value: ethers.parseEther("0.1"),
      });

      expect(await MooveToken.ownerOf(12345)).to.equal(otherAccount);

      await expect(
        MooveToken.connect(otherAccount3).buyNFTVehicle(12345, {
          value: ethers.parseEther("0.1"),
        })
      ).to.be.revertedWith(
        "The vehicle has already been taken by another user"
      );
    });
    it("Should transfer the NFT to the buyer and change the metadata", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await MooveToken.connect(otherAccount).buyNFTVehicle(12345, {
        value: ethers.parseEther("0.1"),
      });

      expect(await MooveToken.balanceOf(otherAccount)).to.equal(1);
      expect(await MooveToken.ownerOf(12345)).to.equal(otherAccount.address);
      expect(await MooveToken.detailsVehicle(12345)).to.deep.equal([
        BigInt(12345),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        false,
        otherAccount.address,
      ]);
      expect(await MooveToken.availableVehicle(12345)).to.equal(false);
    });
  });
  describe("Testing transferFrom function", () => {
    it("Should revert if the sender isn't the owner of the NFT", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await expect(
        MooveToken.connect(otherAccount).transferFrom(
          owner.address,
          otherAccount.address,
          12345
        )
      ).to.be.reverted;
    });
    it("Should transfer the NFT to the otherAccount", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await MooveToken.connect(owner).transferFrom(
        owner.address,
        otherAccount.address,
        12345
      );

      expect(await MooveToken.ownerOf(12345)).to.equal(otherAccount.address);
      expect(await MooveToken.detailsVehicle(12345)).to.deep.equal([
        BigInt(12345),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        true,
        otherAccount.address,
      ]);
    });
  });
});
