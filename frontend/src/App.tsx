import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Vehicle from "./pages/Vehicle";
import Account from "./pages/Account";

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/vehicle/:idVehicle" element={<Vehicle />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
