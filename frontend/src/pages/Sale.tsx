import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { Link } from "react-router-dom";
import { setCurrentVehicle } from "../state/vehicle/vehicleSlice";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { IFormVehicleInfo } from "../interface";

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

  const { data: vehicleIds } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "arrayVehicleIds",
  });

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
                <nav className="bg-black">
                  <Navbar />
                </nav>
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
                <nav className="bg-black">
                  <Navbar />
                </nav>
                {Array.isArray(vehicleIds) && vehicleIds.length > 0 ? (
                  <div>
                    {vehicleIds.map((idVehicle) => (
                      <div
                        className="border border-solid border-red-600 relative overflow-hidden h-[250px] flex flex-col p-5 justify-end"
                        key={idVehicle}
                      >
                        <span className="text-4xl font-[600] z-10">
                          {Number(idVehicle)}
                        </span>
                        <button className="bg-green-500 text-black w-[150px] rounded-lg p-2 my-5 z-10 hover:bg-black hover:text-white">
                          <Link
                            to={`/vehicle/${idVehicle}`}
                            onClick={() =>
                              dispatch(setCurrentVehicle(Number(idVehicle)))
                            }
                          >
                            Scopri di più
                          </Link>
                        </button>
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
