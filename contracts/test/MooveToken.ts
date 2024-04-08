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
      expect(await MooveToken.arrayVehicleIds()).to.deep.equal([BigInt(12345)]);
    });
  });
  describe("Testing addVehicleAuctions function", () => {
    it("Should revert if the sender is not the Owner", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await expect(
        MooveToken.connect(otherAccount).addVehicleAuctions(
          12345,
          "Bike",
          "Electric"
        )
      ).to.be.reverted;
    });
    it("Should add the vehicle and generete the ERC721 token", async () => {
      const { owner, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions(12345, "Bike", "Electric");

      expect(await MooveToken.availableVehicle(12345)).to.equal(true);
      expect(await MooveToken.detailsVehicle(12345)).to.deep.equal([
        BigInt(12345),
        "Bike",
        "Electric",
        0,
        true,
        owner.address,
      ]);
      expect(await MooveToken.balanceOf(owner.address)).to.equal(1);
      expect(await MooveToken.arrayAuctionsVehicles()).to.deep.equal([
        BigInt(12345),
      ]);
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
      ).to.be.revertedWith("Vehicle doesn't found");
    });
    it("Should remove the NFT from the array after the purchase of the user", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      expect(await MooveToken.arrayVehicleIds()).to.deep.equal([BigInt(12345)]);

      await MooveToken.connect(otherAccount).buyNFTVehicle(12345, {
        value: ethers.parseEther("0.1"),
      });

      expect(await MooveToken.ownerOf(12345)).to.equal(otherAccount);

      expect(await MooveToken.arrayVehicleIds()).to.deep.equal([]);
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
    it("Shuold add the NFT vehicle to the purchasedVehicles mapping of the sender", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.connect(otherAccount).buyNFTVehicle(12345, {
        value: ethers.parseEther("1"),
      });

      expect(
        await MooveToken.arrayPurchasedVehiclesByAddress(otherAccount.address)
      ).to.deep.equal([BigInt(12345)]);
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
  describe("Testing arrayVehicleIds function", () => {
    it("Should return the array of the allVehicle", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.addVehicle(
        246810,
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      const vehicleIds = await MooveToken.arrayVehicleIds();

      expect(vehicleIds).to.deep.equal([BigInt(12345), BigInt(246810)]);
    });
  });
  describe("Testing arrayVehiclesPurchased function", () => {
    it("Should return the array of the purchased vehicle", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.addVehicle(
        246810,
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.buyNFTVehicle(12345, { value: ethers.parseEther("1") });

      expect(await MooveToken.arrayVehiclesPurchased()).to.deep.equal([
        BigInt(12345),
      ]);
    });
  });
  describe("Testing arrayPurchasedVehiclesByAddress function", () => {
    it("Should return the array of the purchased vehicle by a specific account", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle(
        12345,
        "Bike",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.addVehicle(
        246810,
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.buyNFTVehicle(12345, { value: ethers.parseEther("1") });

      await MooveToken.connect(otherAccount).buyNFTVehicle(246810, {
        value: ethers.parseEther("1"),
      });

      expect(
        await MooveToken.arrayPurchasedVehiclesByAddress(otherAccount)
      ).to.deep.equal([BigInt(246810)]);
    });
  });
  describe("Testing arrayAuctionsVehicles function", () => {
    it("Should return the array of the allAuctionsVehicles", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions(12345, "Bike", "Electric");

      expect(await MooveToken.arrayAuctionsVehicles()).to.deep.equal([
        BigInt(12345),
      ]);
    });
  });
  describe("Testing getCurrentTimestamp function", () => {
    it("Should return the correct block timestamp", async () => {
      const { MooveToken } = await loadFixture(deploy);

      const block = await ethers.provider.getBlock("latest");

      expect(await MooveToken.getCurrentTimestamp()).to.deep.equal(
        block?.timestamp
      );
    });
  });
});
