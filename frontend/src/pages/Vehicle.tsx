import React from "react";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";

const Vehicle = () => {
  const currentVehicle = useSelector(
    (state: RootState) => state.vehicle.currentVehicle
  );

  return (
    <React.StrictMode>
      <div>
        <div className="bg-black">
          <Navbar />
        </div>
        <h1>{currentVehicle}</h1>
      </div>
    </React.StrictMode>
  );
};

export default Vehicle;
