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
          "Bike",
          "Electric",
          ethers.parseEther("0.1")
        )
      ).to.be.reverted;
    });
    it("Should add the vehicle and generete the ERC721 token", async () => {
      const { owner, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("0.1"));

      expect(await MooveToken.availableVehicle(1)).to.equal(true);
      expect(await MooveToken.detailsVehicle(1)).to.deep.equal([
        BigInt(1),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        0,
      ]);
      expect(await MooveToken.balanceOf(owner.address)).to.equal(1);
      expect(await MooveToken.availableVehicleIds()).to.deep.equal([BigInt(1)]);
    });
  });
  describe("Testing addVehicleAuctions function", () => {
    it("Should revert if the sender is not the Owner", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await expect(
        MooveToken.connect(otherAccount).addVehicleAuctions("Bike", "Electric")
      ).to.be.reverted;
    });
    it("Should add the vehicle and generete the ERC721 token", async () => {
      const { owner, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions("Bike", "Electric");

      expect(await MooveToken.availableVehicle(1)).to.equal(true);
      expect(await MooveToken.detailsVehicle(1)).to.deep.equal([
        BigInt(1),
        "Bike",
        "Electric",
        0,
        0,
      ]);
      expect(await MooveToken.balanceOf(owner.address)).to.equal(1);
      expect(await MooveToken.availableAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);
    });
  });
  describe("Testing buyNFTVehicle function", () => {
    it("Should revert if the vehicle doesn't exist", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await expect(MooveToken.buyNFTVehicle(1)).to.revertedWith(
        "Vehicle doesn't found"
      );
    });
    it("Should revert if the sender doesn't have enough funds", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("0.1"));

      await expect(MooveToken.buyNFTVehicle(1)).to.revertedWith(
        "Doesn't have enough funds to buy this vehicle"
      );
    });
    it("Should revert if the NFT has already been taken from another user", async () => {
      const { otherAccount, otherAccount3, MooveToken } = await loadFixture(
        deploy
      );

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("0.1"));

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("0.1"),
      });

      expect(await MooveToken.ownerOf(1)).to.equal(otherAccount);

      await expect(
        MooveToken.connect(otherAccount3).buyNFTVehicle(1, {
          value: ethers.parseEther("0.1"),
        })
      ).to.be.revertedWith(
        "The vehicle has already been taken by another user"
      );
    });
    it("Should remove the NFT from the availableVehicleIds after the purchase of the user", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("0.1"));

      expect(await MooveToken.availableVehicleIds()).to.deep.equal([BigInt(1)]);

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("0.1"),
      });

      expect(await MooveToken.ownerOf(1)).to.equal(otherAccount);

      expect(await MooveToken.availableVehicleIds()).to.deep.equal([]);
    });
    it("Should transfer the NFT to the buyer and change the metadata", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("0.1"),
      });

      const provider = await ethers.provider.getBlock("latest");

      const timestamp = provider?.timestamp || 0;

      expect(await MooveToken.balanceOf(otherAccount)).to.equal(1);
      expect(await MooveToken.ownerOf(1)).to.equal(otherAccount.address);
      expect(await MooveToken.detailsVehicle(1)).to.deep.equal([
        BigInt(1),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        timestamp + 1 * 24 * 60 * 60,
      ]);
      expect(await MooveToken.availableVehicle(12345)).to.equal(false);
    });
    it("Shuold add the NFT vehicle to the purchasedVehiclesByAddress of the sender", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("1"));

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("1"),
      });

      expect(
        await MooveToken.purchasedVehiclesByAddress(otherAccount.address)
      ).to.deep.equal([BigInt(1)]);
    });
  });
  describe("Testing transferFrom function", () => {
    it("Should revert if the sender isn't the owner of the NFT", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await expect(
        MooveToken.connect(otherAccount).transferFrom(
          owner.address,
          otherAccount.address,
          1
        )
      ).to.be.reverted;
    });
    it("Should transfer the NFT to the otherAccount", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        "Bike",
        "Electric",
        ethers.parseEther("0.1")
      );

      await MooveToken.connect(owner).transferFrom(
        owner.address,
        otherAccount.address,
        1
      );

      expect(await MooveToken.ownerOf(1)).to.equal(otherAccount.address);
      expect(await MooveToken.detailsVehicle(1)).to.deep.equal([
        BigInt(1),
        "Bike",
        "Electric",
        ethers.parseEther("0.1"),
        0,
      ]);
    });
  });
  describe("Testing expiryCheck function", () => {
    it("Should revert if the vehicle doesn't exist", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await expect(MooveToken.expiryCheck(12345)).to.revertedWith(
        "Vehicle doesn't found"
      );
    });
    it("Should revert if the subscription has not yet expired", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("1"));

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("1"),
      });

      await expect(MooveToken.expiryCheck(1)).to.be.revertedWith(
        "The subscription has not yet expired"
      );
    });
    it("Should make the NFT vehicle avaible", async () => {
      const { owner, otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.connect(owner).addVehicle(
        "Bike",
        "Electric",
        ethers.parseEther("1")
      );

      expect(await MooveToken.availableVehicleIds()).to.deep.equal([BigInt(1)]);

      await MooveToken.connect(otherAccount).buyNFTVehicle(1, {
        value: ethers.parseEther("1"),
      });

      expect(await MooveToken.ownerOf(1)).to.equal(otherAccount.address);
      expect(await MooveToken.availableVehicle(1)).to.equal(false);
      expect(await MooveToken.availableVehicleIds()).to.deep.equal([]);
      expect(await MooveToken.purchasedVehicleIds()).to.deep.equal([BigInt(1)]);
      expect(
        await MooveToken.purchasedVehiclesByAddress(otherAccount.address)
      ).to.deep.equal([BigInt(1)]);

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(await MooveToken.connect(owner).expiryCheck(1))
        .to.emit(MooveToken, "VehicleExpired")
        .withArgs(1);

      expect(await MooveToken.availableVehicle(1)).to.equal(true);
      expect(await MooveToken.purchasedVehicleIds()).to.deep.equal([]);
      expect(
        await MooveToken.purchasedVehiclesByAddress(otherAccount.address)
      ).to.deep.equal([]);

      await MooveToken.connect(owner).buyNFTVehicle(1, {
        value: ethers.parseEther("1"),
      });

      expect(await MooveToken.ownerOf(1)).to.equal(owner.address);
      expect(
        await MooveToken.purchasedVehiclesByAddress(owner.address)
      ).to.deep.equal([BigInt(1)]);
    });
  });
  describe("Testing availableVehicleIds function", () => {
    it("Should return the avaible vehicle ids", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("1"));

      await MooveToken.addVehicle(
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      expect(await MooveToken.availableVehicleIds()).to.deep.equal([
        BigInt(1),
        BigInt(2),
      ]);
    });
  });
  describe("Testing availableAuctionVehicleIds function", () => {
    it("Should return the avaible auction vehicle ids", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions("Bike", "Electric");

      await MooveToken.addVehicleAuctions("Scooter", "Electric");

      expect(await MooveToken.availableAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
        BigInt(2),
      ]);
    });
  });
  describe("Testing purchasedVehicleIds function", () => {
    it("Should return the purchased vehicle", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("1"));

      await MooveToken.addVehicle(
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.buyNFTVehicle(1, { value: ethers.parseEther("1") });

      expect(await MooveToken.purchasedVehicleIds()).to.deep.equal([BigInt(1)]);
    });
  });
  describe("Testing purchasedAuctionVehicleIds function", () => {
    it("Should return the purchased auciton vehicle", async () => {
      const { MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicleAuctions("Bike", "Electric");

      await MooveToken.addVehicleAuctions("Scooter", "Electric");

      await MooveToken.buyNFTVehicle(1, { value: ethers.parseEther("1") });

      expect(await MooveToken.purchasedAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);
    });
  });
  describe("Testing purchasedVehiclesByAddress function", () => {
    it("Should return the array of the purchased vehicle by a specific account", async () => {
      const { otherAccount, MooveToken } = await loadFixture(deploy);

      await MooveToken.addVehicle("Bike", "Electric", ethers.parseEther("1"));

      await MooveToken.addVehicle(
        "Scooter",
        "Electric",
        ethers.parseEther("1")
      );

      await MooveToken.buyNFTVehicle(1, { value: ethers.parseEther("1") });

      await MooveToken.connect(otherAccount).buyNFTVehicle(2, {
        value: ethers.parseEther("1"),
      });

      expect(
        await MooveToken.purchasedVehiclesByAddress(otherAccount.address)
      ).to.deep.equal([BigInt(2)]);
    });
  });
  //  DA TESTARE IN VEHICLEAUCTION CONTRACT IN QUANTO NON POSSO INIZIARE L'ASTA
  // describe("Testing purchasedAuctionVehiclesByAddress function", () => {
  //   it("Should return the array of the purchased auction vehicle by a specific account", async () => {
  //     const { otherAccount, MooveToken } = await loadFixture(deploy);

  //     await MooveToken.addVehicleAuctions("Bike", "Electric");

  //     await MooveToken.

  //     expect(
  //       await MooveToken.purchasedAuctionVehiclesByAddress(otherAccount.address)
  //     ).to.deep.equal([BigInt(2)]);
  //   });
  // });
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
