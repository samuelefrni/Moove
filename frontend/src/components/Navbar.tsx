import React from "react";

import { INavbar } from "../interface";
import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const Navbar: React.FC<INavbar> = ({
  hamburgerMenuIsOpen,
  setHamburgerMenuIsOpen,
}) => {
  return (
    <React.StrictMode>
      <nav className="flex justify-between p-5 text-white xl:p-8">
        <h1 className="z-10 text-3xl bg-transparent xl:text-5xl">Moove</h1>
        {hamburgerMenuIsOpen ? (
          <IoMdClose
            className="z-10 text-4xl bg-transparent cursor-pointer xl:text-6xl"
            onClick={() => setHamburgerMenuIsOpen((prevState) => !prevState)}
          />
        ) : (
          <IoIosMenu
            className="z-10 text-4xl bg-transparent cursor-pointer xl:text-6xl"
            onClick={() => setHamburgerMenuIsOpen((prevState) => !prevState)}
          />
        )}
      </nav>
    </React.StrictMode>
  );
};

export default Navbar;
