import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { IAddVehicle } from "../interface";

const Sale = () => {
  const account = useAccount();
  const { writeContract } = useWriteContract();

  const [addVehicleInfo, setAddVehicleInfo] = useState<IAddVehicle>({
    id: "",
    name: "",
    model: "",
    price: "",
  });

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const { data: ownerOfContract } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "owner",
  });

  const { data: allVehicle } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "allVehicle",
    args: [0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    setAddVehicleInfo({ ...addVehicleInfo, [placeholder]: value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddVehicleInfo({
      id: "",
      name: "",
      model: "",
      price: "",
    });
  };

  const handleAddVehicleTx = (
    id: string | number,
    name: string,
    model: string,
    price: string | number
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
                  className="border border-solid border-red-600"
                  onSubmit={() => handleSubmit}
                >
                  <input
                    type="text"
                    placeholder="id"
                    value={addVehicleInfo?.id}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="name"
                    value={addVehicleInfo?.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="model"
                    value={addVehicleInfo?.model}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="price"
                    value={addVehicleInfo?.price}
                    onChange={handleInputChange}
                  />
                  <button
                    type="submit"
                    onClick={() =>
                      handleAddVehicleTx(
                        addVehicleInfo.id,
                        addVehicleInfo.name,
                        addVehicleInfo.model,
                        addVehicleInfo.price
                      )
                    }
                  >
                    Add Vehicle
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="bg-black">
                  <Navbar />
                </div>
                <div>
                  <h2>All Id Vehicle</h2>
                  <p>{String(allVehicle)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Sale;
