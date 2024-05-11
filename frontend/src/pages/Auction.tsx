import React from "react";
import { useReadContract } from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { Link } from "react-router-dom";
import { setCurrentVehicle } from "../state/vehicle/vehicleSlice";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import ImageMission from "../assets/5fcfe0b8f3d03a879fe49d11_timur-romanov-osNaWvJ1D1E-unsplash.jpg";

const Auction = () => {
  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const dispatch = useDispatch();

  const { data: auctionsVehicles } = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "arrayAuctionsVehicles",
  });

  const { data: auctionVehiclePurchased } = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "arrayAuctionVehiclePurchased",
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
            {Array.isArray(auctionsVehicles) && auctionsVehicles.length > 0 ? (
              auctionsVehicles.map((idVehicle) => (
                <div
                  className="relative overflow-hidden h-[250px] flex flex-col justify-end p-10"
                  key={idVehicle}
                >
                  <span className="text-4xl text-white font-[600] z-10">
                    {Number(idVehicle)}
                  </span>
                  <button className="bg-green-500 text-white w-[150px] rounded-lg p-2 mt-5 z-10 hover:bg-black hover:text-white xl:text-xl xl:w-[200px]">
                    <Link
                      to={`/vehicle/${idVehicle}`}
                      onClick={() =>
                        dispatch(setCurrentVehicle(Number(idVehicle)))
                      }
                    >
                      Scopri di più
                    </Link>
                  </button>
                  <div className="bg-black absolute w-[400%] top-[100%] left-[120%] translate-x-[-50%] translate-y-[-50%] lg:w-[200%] lg:left-[50%] xl:w-[120%]">
                    <img
                      src={ImageMission}
                      alt="Moove Mission Image"
                      className="opacity-60 blur-[5px]"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col">
                <span className="italic font-[600] p-10 text-center xl:text-xl">
                  In this moment there aren't vehicles in auction. In the next 7
                  days the vehicles that you see below should be return
                  available.
                </span>
                <div className="text-center">
                  {Array.isArray(auctionVehiclePurchased) && (
                    <div>
                      {auctionVehiclePurchased.map((item) => (
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

export default Auction;
