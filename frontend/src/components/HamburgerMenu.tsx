import React from "react";
import { useAccount } from "wagmi";

import Navbar from "./Navbar";
import { IHamburgerMenu } from "../interface";

const HamburgerMenu: React.FC<IHamburgerMenu> = ({
  hamburgerMenuIsOpen,
  setHamburgerMenuIsOpen,
}) => {
  const account = useAccount();

  return (
    <React.StrictMode>
      <div>
        <Navbar
          hamburgerMenuIsOpen={hamburgerMenuIsOpen}
          setHamburgerMenuIsOpen={setHamburgerMenuIsOpen}
        />
      </div>
    </React.StrictMode>
  );
};

export default HamburgerMenu;
