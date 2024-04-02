import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useSelector } from "react-redux";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { RootState } from "../state/store";
import { IFormAuctionVehicleInfo, IFormVehicleInfo } from "../interface";

const Account = () => {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const [formVehicleInfo, setFormVehicleInfo] = useState<IFormVehicleInfo>({
    id: "",
    name: "",
    model: "",
    price: "",
  });

  const [formAuctionVehicleInfo, setFormAuctionVehicleInfo] =
    useState<IFormAuctionVehicleInfo>({
      id: "",
      name: "",
      model: "",
    });

  const { data: ownerOfContract } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "owner",
  });

  const { data: purchasedVehiclesByAddress } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "arrayPurchasedVehiclesByAddress",
    args: [account.address],
  });

  const handleInputChangeAddVehicle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { placeholder, value } = e.target;
    setFormVehicleInfo({ ...formVehicleInfo, [placeholder]: value });
  };

  const handleInputChangeAddAuction = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { placeholder, value } = e.target;
    setFormAuctionVehicleInfo({
      ...formAuctionVehicleInfo,
      [placeholder]: value,
    });
  };

  const handleAddVehicleTx = (
    id: number,
    name: string | number,
    model: string | number,
    price: number
  ) => {
    writeContract({
      abi,
      address: contractAddress,
      account: account.address,
      functionName: "addVehicle",
      args: [id, name, model, price],
      nonce: 1,
    });
  };

  const handleAddAuctionVehicleTx = (
    id: number,
    name: string | number,
    model: string | number
  ) => {
    writeContract({
      abi,
      address: contractAddress,
      account: account.address,
      functionName: "addVehicleAuctions",
      args: [id, name, model],
      nonce: 1,
    });
  };

  const handleAddNewNFTSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formVehicleInfo.id &&
      formVehicleInfo.name &&
      formVehicleInfo.model &&
      formVehicleInfo.price
    ) {
      handleAddVehicleTx(
        Number(formVehicleInfo.id),
        formVehicleInfo.name,
        formVehicleInfo.model,
        Number(formVehicleInfo.price)
      );
      setFormVehicleInfo({
        id: "",
        name: "",
        model: "",
        price: "",
      });
    } else {
      alert(
        "To create an NFT vehicle all the fields in the form must be filled in."
      );
    }
  };

  const handleAddAuctionNFTSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formAuctionVehicleInfo.id &&
      formAuctionVehicleInfo.name &&
      formAuctionVehicleInfo.model
    ) {
      handleAddAuctionVehicleTx(
        Number(formVehicleInfo.id),
        formVehicleInfo.name,
        formVehicleInfo.model
      );
      setFormAuctionVehicleInfo({
        id: "",
        name: "",
        model: "",
      });
    } else {
      alert(
        "To create an NFT vehicle all the fields in the form must be filled in."
      );
    }
  };

  return (
    <React.StrictMode>
      <div>
        {hamburgerMenuIsOpen ? (
          <div>
            <Navbar />
            <HamburgerMenu />
          </div>
        ) : (
          <div>
            {account.address == ownerOfContract ? (
              <div>
                <nav className="bg-black">
                  <Navbar />
                </nav>
                <form
                  className="flex flex-col justify-center items-center"
                  onSubmit={(e: React.ChangeEvent<HTMLFormElement>) =>
                    handleAddNewNFTSubmit(e)
                  }
                >
                  <span className="italic p-10 font-[600] text-center xl:text-xl">
                    Add new NFT vehicle
                  </span>
                  <p className="px-5 text-justify xl:text-xl">
                    <br /> Here you can add new NFT vehicles that will appear in
                    the Sale section. It is very important to enter the correct
                    information on the NFT vehicle, this is because the action
                    on the blockchain is not reversible. For this reason it is
                    important to understand which values to enter, as an error
                    could lead to an incorrect sale. Remember that the value you
                    enter in the "price" field is expressed in wei.
                  </p>
                  <div className="text-center my-5">
                    <input
                      type="text"
                      placeholder="id"
                      value={formVehicleInfo?.id}
                      onChange={handleInputChangeAddVehicle}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="name"
                      value={formVehicleInfo?.name}
                      onChange={handleInputChangeAddVehicle}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="model"
                      value={formVehicleInfo?.model}
                      onChange={handleInputChangeAddVehicle}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="price"
                      value={formVehicleInfo?.price}
                      onChange={handleInputChangeAddVehicle}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <button
                      type="submit"
                      className="m-5 p-3 w-[200px] bg-black text-xl font-[600] text-white rounded-xl hover:bg-gray-100 hover:text-black"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
                <hr />
                <form
                  className="flex flex-col justify-center items-center"
                  onSubmit={(e: React.ChangeEvent<HTMLFormElement>) =>
                    handleAddAuctionNFTSubmit(e)
                  }
                >
                  <span className="italic p-10 font-[600] text-center xl:text-xl">
                    Add new auction for NFT vehicle
                  </span>
                  <p className="px-5 text-justify xl:text-xl">
                    <br /> Here you can add new NFT vehicles acution that will
                    appear in the Auction section. It is very important to enter
                    the correct information on the NFT vehicle, this is because
                    the action on the blockchain is not reversible. For this
                    reason it is important to understand which values to enter,
                    as an error could lead to an incorrect sale. There is no
                    "price" field in this form because it will start with zero.
                  </p>
                  <div className="text-center my-5">
                    <input
                      type="text"
                      placeholder="id"
                      value={formAuctionVehicleInfo.id}
                      onChange={handleInputChangeAddAuction}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="name"
                      value={formAuctionVehicleInfo.name}
                      onChange={handleInputChangeAddAuction}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="model"
                      value={formAuctionVehicleInfo.model}
                      onChange={handleInputChangeAddAuction}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <button
                      type="submit"
                      className="m-5 p-3 w-[200px] bg-black text-xl font-[600] text-white rounded-xl hover:bg-gray-100 hover:text-black"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="bg-black">
                  <Navbar />
                </div>
                <div className="border border-solid border-red-600 flex flex-col items-center">
                  <span className="p-10">{account.address}</span>
                  <div className="border border-solid border-blue-600 flex flex-col">
                    <span className="font-[600] p-10">Your vehicle</span>
                    <div>
                      {Array.isArray(purchasedVehiclesByAddress) &&
                        purchasedVehiclesByAddress.length > 0 && (
                          <div>
                            {purchasedVehiclesByAddress.map((vehicle) => (
                              <div>
                                <p>{Number(vehicle)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Account;
