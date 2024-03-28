import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { Link } from "react-router-dom";
import { setCurrentVehicle } from "../state/vehicle/vehicleSlice";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { IFormVehicleInfo, IVehicleInfo } from "../interface";
import ElectricScooter from "../assets/best-electric-scooter.jpg";
import ElectricBike from "../assets/2021011409531570234.jpeg";

const Sale = () => {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const dispatch = useDispatch();

  const [formVehicleInfo, setFormVehicleInfo] = useState<IFormVehicleInfo>({
    id: "",
    name: "",
    model: "",
    price: "",
  });

  const { data: ownerOfContract } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "owner",
  });

  const { data: vehicleId } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "arrayVehicleIds",
  });

  const readInfoVehicle = (id: bigint): IVehicleInfo | undefined => {
    const { data: infoVehicle } = useReadContract({
      abi: [
        {
          type: "function",
          name: "detailsVehicle",
          stateMutability: "view",
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "model",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "priceVehicle",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "available",
              type: "bool",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
        },
      ],
      address: contractAddress,
      functionName: "detailsVehicle",
      args: [id],
    });

    if (infoVehicle) {
      const result: IVehicleInfo = {
        id: Number(infoVehicle[0]),
        name: infoVehicle[1],
        model: infoVehicle[2],
        price: Number(infoVehicle[3]),
        available: infoVehicle[4],
        owner: infoVehicle[5],
      };
      return result;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    setFormVehicleInfo({ ...formVehicleInfo, [placeholder]: value });
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
      nonce: 2,
    });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
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
                <div className="bg-black">
                  <Navbar />
                </div>
                <form
                  className="flex flex-col justify-center items-center"
                  onSubmit={(e: React.ChangeEvent<HTMLFormElement>) =>
                    handleSubmit(e)
                  }
                >
                  <span className="italic p-10 font-[600] text-center xl:text-xl">
                    This section is available only to the author of the contract
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
                      onChange={handleInputChange}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="name"
                      value={formVehicleInfo?.name}
                      onChange={handleInputChange}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="model"
                      value={formVehicleInfo?.model}
                      onChange={handleInputChange}
                      className="m-5 p-2 bg-gray-100 rounded-sm placeholder:text-lg xl:text-2xl"
                    />
                    <input
                      type="text"
                      placeholder="price"
                      value={formVehicleInfo?.price}
                      onChange={handleInputChange}
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
                {Array.isArray(vehicleId) && vehicleId.length > 0 ? (
                  <div>
                    {vehicleId.map((idVehicle) => (
                      <div
                        className="border border-solid border-red-600 relative overflow-hidden h-[250px] flex flex-col p-5 justify-end"
                        key={idVehicle}
                      >
                        <span className="text-4xl font-[600] z-10 text-white">
                          <Link
                            to={`/vehicle/${idVehicle}`}
                            onClick={() =>
                              dispatch(setCurrentVehicle(Number(idVehicle)))
                            }
                          >
                            {Number(idVehicle)}
                          </Link>
                        </span>
                        <button className="bg-green-600 text-white w-[150px] rounded-lg p-2 my-5 z-10">
                          Scopri di più
                        </button>
                        {readInfoVehicle(idVehicle)?.name == "Scooter" ? (
                          <div className="bg-black absolute w-[130%] top-[30%] left-[55%] translate-x-[-50%] translate-y-[-50%] scale-x-[-1]">
                            <img
                              src={ElectricScooter}
                              alt="Electric scooter"
                              className="opacity-80"
                            />
                          </div>
                        ) : (
                          <div className="bg-black absolute w-[130%] top-[30%] left-[65%] translate-x-[-50%] translate-y-[-50%]">
                            <img
                              src={ElectricBike}
                              alt="Bike scooter"
                              className="opacity-80"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[250px] flex flex-col p-5 text-center">
                    <span className="italic p-10 font-[600] text-center xl:text-xl">
                      In this moment there aren't vehicles in sale
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Sale;
