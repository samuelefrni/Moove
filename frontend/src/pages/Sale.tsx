import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";

const Sale = () => {
  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

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
            <div className="bg-black">
              <Navbar />
            </div>
            <div className="border border-solid border-red-600">
              <h1>X</h1>
            </div>
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default Sale;
