import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Vehicle from "./pages/Vehicle";
import Account from "./pages/Account";
import Auction from "./pages/Auction";

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/vehicle/:idVehicle" element={<Vehicle />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
