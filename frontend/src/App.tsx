import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Vehicle from "./pages/Vehicle";

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/vehicle/:idVehicle" element={<Vehicle />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
