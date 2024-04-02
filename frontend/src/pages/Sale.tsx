import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useReadContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { Link } from "react-router-dom";
import { setCurrentVehicle } from "../state/vehicle/vehicleSlice";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";

const Sale = () => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const dispatch = useDispatch();

  const { data: vehicleIds } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "arrayVehicleIds",
  });

  const { data: purchasedVehicle } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "arrayVehiclesPurchased",
  });

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
                    <button className="bg-green-500 text-white w-[150px] rounded-lg p-2 my-5 z-10 hover:bg-black hover:text-white">
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
              <div className="flex flex-col">
                <span className="italic font-[600] p-10 text-center xl:text-xl">
                  In this moment there aren't vehicles in sale. In the next 24h
                  the vehicles that you see below should be return available.
                </span>
                <div className="text-center">
                  {Array.isArray(purchasedVehicle) && (
                    <div>
                      {purchasedVehicle.map((item) => (
                        <div className="p-10" key={item}>
                          <Link
                            to={`/vehicle/${item}`}
                            onClick={() =>
                              dispatch(setCurrentVehicle(Number(item)))
                            }
                          >
                            <span className="text-4xl cursor-pointer hover:opacity-50">
                              {Number(item)}
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
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
