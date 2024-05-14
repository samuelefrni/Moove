import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../artifacts/contracts/VehicleAuctions.sol/VehicleAuctions.json";
import { Link } from "react-router-dom";
import { setCurrentVehicle } from "../state/vehicle/vehicleSlice";
import { setHamburgerMenuIsOpen } from "../state/navbar/navbarSlice";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import ImageMission from "../assets/5fcfe0b8f3d03a879fe49d11_timur-romanov-osNaWvJ1D1E-unsplash.jpg";
import { Helmet } from "react-helmet";

const Sale = () => {
  const account = useAccount();
  const dispatch = useDispatch();

  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const { data: vehicleIds } = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "arrayVehicleIds",
  });

  const { data: purchasedVehicle } = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "arrayVehiclesPurchased",
  });

  return (
    <React.StrictMode>
      <Helmet>
        <title>Moove | Sale Vehicles</title>
        <meta
          name="description"
          content="Page dedicated to the vehicles in sale"
        />
      </Helmet>
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
            {account.status === "connected" &&
            Array.isArray(vehicleIds) &&
            vehicleIds.length > 0 ? (
              <div>
                {vehicleIds.map((idVehicle) => (
                  <div
                    className="relative overflow-hidden h-[250px] flex flex-col justify-end p-10"
                    key={idVehicle}
                  >
                    <span className="text-4xl font-[600] z-10 text-white">
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
                    <div className="bg-black absolute w-[400%] top-[100%] left-[120%] translate-x-[-50%] translate-y-[-50%] lg:w-[200%] lg:left-[50%] xl:w-[120%]">
                      <img
                        src={ImageMission}
                        alt="Moove Mission Image"
                        className="opacity-60 blur-[5px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : account.status === "connected" ? (
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
            ) : (
              <div className="flex flex-col">
                <span
                  className="italic font-[600] p-10 text-center cursor-pointer xl:text-xl"
                  onClick={() => dispatch(setHamburgerMenuIsOpen())}
                >
                  Connect your account to view vehicles in sale
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Sale;
