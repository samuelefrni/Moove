import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
