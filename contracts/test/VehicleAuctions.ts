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

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await expect(VehicleAuctions.connect(otherAccount).startAuction(12345)).to
        .be.reverted;
    });
    it("Should revert if the id of the vehicle doesn't exist", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await expect(VehicleAuctions.startAuction(12345)).to.be.revertedWith(
        "Id of the vehicle doesn't found"
      );
    });
    it("Should start the auction and adding the correct metadata", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      const provider = await ethers.provider.getBlock("latest");

      const timestamp = provider?.timestamp || 0;

      const Plus1Day = timestamp + 1 * 24 * 60 * 60;

      expect(await VehicleAuctions.auctionStatus(12345)).to.deep.equal([
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
      ).to.be.revertedWith("Id of the vehicle doesn't found");
    });
    it("Shuold revert if the auction hasn't started yet", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await expect(
        VehicleAuctions.participateAuction(12345)
      ).to.be.revertedWith("The auction hasn't started yet");
    });
    it("Shuold revert if the auction has been closed", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await ethers.provider.send("evm_increaseTime", [86401]);

      await ethers.provider.send("evm_mine");

      await expect(
        VehicleAuctions.participateAuction(12345)
      ).to.be.revertedWith("The auction has been closed");
    });
    it("Shuold revert if the value of the sender is less than the winningBid", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("0.002"),
      });

      await expect(
        VehicleAuctions.connect(otherAccount3).participateAuction(12345, {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith(
        "The ether value you send has be greater than the winning bid"
      );
    });
    it("Shuold upgrade the auctionStatus with the correct metadata", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      const provider = await ethers.provider.getBlock("latest");

      const timestamp = provider?.timestamp || 0;

      const Plus1Day = timestamp + 1 * 24 * 60 * 60;

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("0.002"),
      });

      expect(await VehicleAuctions.auctionStatus(12345)).to.deep.equal([
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
        "Id of the vehicle doesn't found"
      );
    });
    it("Shuold revert if the sender who call the functions isn't the ownerBid", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await expect(
        VehicleAuctions.connect(otherAccount3).withdrawNFT(12345)
      ).to.be.revertedWith("Only the winner of the auction can withdrawals");
    });
    it("Shuold revert if auction hasn't finished", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await expect(
        VehicleAuctions.connect(otherAccount).withdrawNFT(12345)
      ).to.be.revertedWith("Auction for this vehicle hasn't finished");
    });
    it("Should transfer the NFT to the winner of the auction and push the id in auctionVehiclePurchased", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(12345, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(12345);

      expect(
        await VehicleAuctions.arrayAuctionVehiclePurchased()
      ).to.deep.equal([BigInt(12345)]);
      expect(await VehicleAuctions.ownerOf(12345)).to.equal(otherAccount3);
    });
    it("Should remove the id of the vehicle from the allAuctionsVehicles array after the withdraw", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(12345, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(12345);

      expect(await VehicleAuctions.arrayAuctionsVehicles()).to.deep.equal([]);
    });
    it("Should return the purchased vehicle id from an specific account", async () => {
      const { otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");
      await VehicleAuctions.addVehicleAuctions(246810, "Scooter", "Electric");

      await VehicleAuctions.startAuction(12345);
      await VehicleAuctions.startAuction(246810);

      await VehicleAuctions.connect(otherAccount).participateAuction(246810, {
        value: ethers.parseEther("1"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(12345, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount3).withdrawNFT(12345);
      await VehicleAuctions.connect(otherAccount).withdrawNFT(246810);

      expect(
        await VehicleAuctions.arrayAuctionVehiclePurchasedByAddress(
          otherAccount
        )
      ).to.deep.equal([BigInt(246810)]);
      expect(
        await VehicleAuctions.arrayAuctionVehiclePurchasedByAddress(
          otherAccount3
        )
      ).to.deep.equal([BigInt(12345)]);
      expect(await VehicleAuctions.ownerOf(12345)).to.equal(otherAccount3);
      expect(await VehicleAuctions.ownerOf(246810)).to.equal(otherAccount);
    });
    it("Should change the mapping withdrawhed to true", async () => {
      const { otherAccount, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");
      await VehicleAuctions.addVehicleAuctions(24681, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);
      await VehicleAuctions.startAuction(24681);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("2"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(12345);

      expect(await VehicleAuctions.hasWithdrawhed(12345)).to.equal(true);
      expect(await VehicleAuctions.hasWithdrawhed(24681)).to.equal(false);
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

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(12345);

      await expect(
        VehicleAuctions.connect(otherAccount).recoverFunds(12345)
      ).to.be.revertedWith("Winner of the auction can't recover funds");
    });
    it("Shuold revert if auction hasn't finished", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await expect(
        VehicleAuctions.connect(owner).recoverFunds(12345)
      ).to.be.revertedWith("Auction for this vehicle hasn't finished");
    });
    it("Should recover the funds to the sender that call the function", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      const initialBalanceOwner = await ethers.provider.getBalance(owner);

      await VehicleAuctions.connect(owner).participateAuction(12345, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("100"),
      });

      await VehicleAuctions.connect(owner).participateAuction(12345, {
        value: ethers.parseEther("500"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(12345);

      expect(await VehicleAuctions.ownerOf(12345)).to.equal(
        otherAccount.address
      );

      await VehicleAuctions.connect(owner).recoverFunds(12345);

      const tolerance = ethers.parseEther("0.001");

      const finalBalanceOwner = await ethers.provider.getBalance(owner);

      expect(finalBalanceOwner).to.be.closeTo(initialBalanceOwner, tolerance);
    });
    it("Should change the mapping fundsRecovered to true", async () => {
      const { owner, otherAccount, otherAccount3, VehicleAuctions } =
        await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(owner).participateAuction(12345, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount3).participateAuction(12345, {
        value: ethers.parseEther("80"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(12345);

      expect(await VehicleAuctions.ownerOf(12345)).to.equal(
        otherAccount.address
      );

      await VehicleAuctions.connect(owner).recoverFunds(12345);

      expect(await VehicleAuctions.hasRecoveredFunds()).to.equal(true);
      expect(
        await VehicleAuctions.connect(otherAccount3).hasRecoveredFunds()
      ).to.equal(false);
    });
    it("Should revert if the sender has already recovered funds", async () => {
      const { owner, otherAccount, VehicleAuctions } = await loadFixture(
        deploy
      );

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");

      await VehicleAuctions.startAuction(12345);

      await VehicleAuctions.connect(owner).participateAuction(12345, {
        value: ethers.parseEther("50"),
      });

      await VehicleAuctions.connect(otherAccount).participateAuction(12345, {
        value: ethers.parseEther("1000"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.connect(otherAccount).withdrawNFT(12345);

      expect(await VehicleAuctions.ownerOf(12345)).to.equal(
        otherAccount.address
      );

      await VehicleAuctions.connect(owner).recoverFunds(12345);

      expect(await VehicleAuctions.hasRecoveredFunds()).to.equal(true);

      await expect(VehicleAuctions.recoverFunds(12345)).to.revertedWith(
        "Funds already recovered"
      );
    });
  });
  describe("Testing arrayAuctionVehiclePurchased function", () => {
    it("Should return the auctionVehiclePurchased array", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");
      await VehicleAuctions.startAuction(12345);
      await VehicleAuctions.participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.withdrawNFT(12345);

      expect(
        await VehicleAuctions.arrayAuctionVehiclePurchased()
      ).to.deep.equal([BigInt(12345)]);
    });
  });
  describe("Testing arrayAuctionVehiclePurchasedByAddress function", () => {
    it("Should return the purchasedAuctionVehiclesByAccount mapping", async () => {
      const { owner, VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");
      await VehicleAuctions.startAuction(12345);
      await VehicleAuctions.participateAuction(12345, {
        value: ethers.parseEther("1"),
      });

      await ethers.provider.send("evm_increaseTime", [100000000]);
      await ethers.provider.send("evm_mine");

      await VehicleAuctions.withdrawNFT(12345);

      expect(
        await VehicleAuctions.arrayAuctionVehiclePurchasedByAddress(
          owner.address
        )
      ).to.deep.equal([BigInt(12345)]);
    });
  });
  describe("Testing isAuctionStarted function", () => {
    it("Should return the isStarted mapping", async () => {
      const { VehicleAuctions } = await loadFixture(deploy);

      await VehicleAuctions.addVehicleAuctions(12345, "Bike", "Electric");
      await VehicleAuctions.startAuction(12345);

      expect(await VehicleAuctions.isAuctionStarted(12345)).to.equal(true);
    });
  });
});
