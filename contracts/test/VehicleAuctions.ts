import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("VehicleAuctions", () => {
  async function deploy() {
    const tokenName = "MooveToken";
    const tokenSymbol = "MT";
    const [owner, otherAccount, otherAccount3] = await ethers.getSigners();
    const VehicleAuctions = await ethers.deployContract("VehicleAuctions", [
      tokenName,
      tokenSymbol,
    ]);

    return {
      tokenName,
      tokenSymbol,
      owner,
      otherAccount,
      otherAccount3,
      VehicleAuctions,
    };
  }
  describe("Testing startAuction function", () => {
    it("Should revert if the sender isn't the owner", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await expect(VehicleAuctions.connect(otherAccount).startAuction(1)).to.be
        .reverted;
    });
    it("Should revert if the id of the vehicle doesn't exist", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(VehicleAuctions.startAuction(12345)).to.be.revertedWith(
        "Vehicle doesn't found"
      );
    });
    it("Should start the auction and adding the correct metadata", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      const provider = await ethers.provider.getBlock("latest");

      const timestamp = provider?.timestamp || 0;

      const Plus1Day = timestamp + 1 * 24 * 60 * 60;

      expect(await VehicleAuctions.auctionStatus(1)).to.deep.equal([
        timestamp,
        Plus1Day,
        BigInt(0),
        0x0000000000000000000000000000000000000000,
      ]);
    });
  });
  describe("Testing participateAuction function", () => {
    it("Shuold revert if id of the vehicle doesn't exist", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(
        VehicleAuctions.participateAuction(12345)
      ).to.be.revertedWith("Vehicle doesn't found");
    });
    it("Shuold revert if the auction hasn't started yet", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await expect(VehicleAuctions.participateAuction(1)).to.be.revertedWith(
        "The auction hasn't started yet"
      );
    });
    it("Shuold revert if the auction has been closed", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await ethers.provider.send("evm_increaseTime", [86401]);

      await ethers.provider.send("evm_mine");

      await expect(VehicleAuctions.participateAuction(1)).to.be.revertedWith(
        "The auction has been closed"
      );
    });
    it("Shuold revert if the value of the sender is less than the winningBid", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("0.002"),
      });

      await expect(
        VehicleAuctions.connect(otherAccount3).participateAuction(1, {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith(
        "The ether value you send has be greater than the winning bid"
      );
    });
    it("Shuold upgrade the auctionStatus with the correct metadata", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      const provider = await ethers.provider.getBlock("latest");

      const timestamp = provider?.timestamp || 0;

      const Plus1Day = timestamp + 1 * 24 * 60 * 60;

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("0.002"),
      });

      expect(await VehicleAuctions.auctionStatus(1)).to.deep.equal([
        timestamp,
        Plus1Day,
        ethers.parseEther("0.002"),
        otherAccount.address,
      ]);
    });
  });
  describe("Testing withdrawNFT function", () => {
    it("Shuold revert if id of the vehicle doesn't exist", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(VehicleAuctions.withdrawNFT(12345)).to.be.revertedWith(
        "Vehicle doesn't found"
      );
    });
    it("Shuold revert if the sender who call the functions isn't the ownerBid", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(
        VehicleAuctions.connect(otherAccount3).withdrawNFT(1)
      ).to.be.revertedWith("Only the winner of the auction can withdrawals");
    });
    it("Shuold revert if auction hasn't finished", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await expect(
        VehicleAuctions.connect(otherAccount).withdrawNFT(1)
      ).to.be.revertedWith("Auction for this vehicle hasn't finished");
    });
    it("Should transfer the NFT to the winner of the auction and push the id in auctionVehiclePurchased", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(1, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(1);

      expect(await VehicleAuctions.purchasedAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);
      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount3);
    });
    it("Should remove the id of the vehicle from the allAuctionsVehicles array after the withdraw", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(1, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(1);

      expect(await VehicleAuctions.availableAuctionVehicleIds()).to.deep.equal(
        []
      );
    });
    it("Should return the purchased vehicle id from an specific account", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");
      await VehicleAuctions.addVehicleAuctions("Scooter", "Electric");

      await VehicleAuctions.startAuction(1);
      await VehicleAuctions.startAuction(2);

      await VehicleAuctions.connect(otherAccount).participateAuction(2, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(1, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(1);
      await VehicleAuctions.connect(otherAccount).withdrawNFT(2);

      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(otherAccount)
      ).to.deep.equal([BigInt(2)]);
      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(otherAccount3)
      ).to.deep.equal([BigInt(1)]);
      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount3);
      expect(await VehicleAuctions.ownerOf(2)).to.equal(otherAccount);
    });
    it("Should change the mapping withdrawhed to true", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");
      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);
      await VehicleAuctions.startAuction(2);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      expect(await VehicleAuctions.withdrawhed(1)).to.equal(true);
      expect(await VehicleAuctions.withdrawhed(2)).to.equal(false);
    });
  });
  describe("Testing recoverFunds function", () => {
    it("Should revert if id of the vehicle isn't already collect by the winner of the auction", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(VehicleAuctions.recoverFunds(12345)).to.be.revertedWith(
        "Please wait until the winner collects the vehicle"
      );
    });
    it("Shuold revert if the sender who call the functions is the ownerBid", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      await expect(
        VehicleAuctions.connect(otherAccount).recoverFunds(1)
      ).to.be.revertedWith("Winner of the auction can't recover funds");
    });
    it("Shuold revert if auction hasn't finished", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await expect(
        VehicleAuctions.connect(owner).recoverFunds(1)
      ).to.be.revertedWith("Auction for this vehicle hasn't finished");
    });
    it("Should recover the funds to the sender that call the function", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      const initialBalanceOwner = await ethers.provider.getBalance(owner);

      await VehicleAuctions.connect(owner).participateAuction(1, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("100"),
      });

      await VehicleAuctions.connect(owner).participateAuction(1, {
        value: ethers.parseEther("500"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount.address);

      await VehicleAuctions.connect(owner).recoverFunds(1);

      const tolerance = ethers.parseEther("0.001");

      const finalBalanceOwner = await ethers.provider.getBalance(owner);

      expect(finalBalanceOwner).to.be.closeTo(initialBalanceOwner, tolerance);
    });
    it("Should change the mapping fundsRecovered to true", async () => {
      const { owner, otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(owner).participateAuction(1, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(1, {
        value: ethers.parseEther("80"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount.address);

      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(
          otherAccount.address
        )
      ).to.deep.equal([BigInt(1)]);

      await VehicleAuctions.connect(owner).recoverFunds(1);

      expect(await VehicleAuctions.fundsRecovered(owner.address)).to.equal(
        true
      );
      expect(
        await VehicleAuctions.fundsRecovered(otherAccount.address)
      ).to.equal(false);
    });
    it("Should revert if the sender has already recovered funds", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(owner).participateAuction(1, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount.address);

      await VehicleAuctions.connect(owner).recoverFunds(1);

      expect(await VehicleAuctions.fundsRecovered(owner.address)).to.equal(
        true
      );

      await expect(VehicleAuctions.recoverFunds(1)).to.revertedWith(
        "Funds already recovered"
      );
    });
  });
  describe("Testing expiryCheckAuction function", () => {
    it("Should revert if the vehicle doesn't exist", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(
        VehicleAuctions.expiryCheckAuction(12345)
      ).to.be.revertedWith("Vehicle doesn't found");
    });
    it("Should revert if the subscription has not yet expired", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount.address);

      await expect(VehicleAuctions.expiryCheckAuction(1)).to.be.revertedWith(
        "The subscription has not yet expired"
      );
    });
    it("Should remove the NFT from auctionVehiclePurchased and make it avaible after send it to allAuctionsVehicles", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");

      await VehicleAuctions.startAuction(1);

      expect(await VehicleAuctions.availableAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);

      await VehicleAuctions.connect(otherAccount).participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(await VehicleAuctions.connect(otherAccount).withdrawNFT(1))
        .to.emit(VehicleAuctions, "VehicleWithdrawhed")
        .withArgs(otherAccount.address, 1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(otherAccount.address);
      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(
          otherAccount.address
        )
      ).to.deep.equal([BigInt(1)]);
      expect(await VehicleAuctions.purchasedAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(await VehicleAuctions.expiryCheckAuction(1))
        .to.emit(VehicleAuctions, "VehicleExpired")
        .withArgs(1);

      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(
          otherAccount.address
        )
      ).to.deep.equal([]);
      expect(await VehicleAuctions.purchasedAuctionVehicleIds()).to.deep.equal(
        []
      );

      await VehicleAuctions.startAuction(1);

      await VehicleAuctions.participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(await VehicleAuctions.withdrawNFT(1))
        .to.emit(VehicleAuctions, "VehicleWithdrawhed")
        .withArgs(owner.address, 1);

      expect(await VehicleAuctions.ownerOf(1)).to.equal(owner.address);
      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(owner.address)
      ).to.deep.equal([BigInt(1)]);
      expect(await VehicleAuctions.purchasedAuctionVehicleIds()).to.deep.equal([
        BigInt(1),
      ]);
    });
  });
  describe("Testing purchasedAuctionVehiclesByAddress function", () => {
    it("Should return the purchasedAuctionVehiclesByAddress mapping", async () => {
      const { owner, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");
      await VehicleAuctions.startAuction(1);
      await VehicleAuctions.participateAuction(1, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.withdrawNFT(1);

      expect(
        await VehicleAuctions.purchasedAuctionVehiclesByAddress(owner.address)
      ).to.deep.equal([BigInt(1)]);
    });
  });
  describe("Testing isAuctionStarted function", () => {
    it("Should return the isStarted mapping", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions("Bike", "Electric");
      await VehicleAuctions.startAuction(1);

      expect(await VehicleAuctions.isStarted(1)).to.equal(true);
    });
  });
});
