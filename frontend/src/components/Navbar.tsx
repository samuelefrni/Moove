import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setHamburgerMenuIsOpen } from "../state/navbar/navbarSlice";

import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  const hamburgerMenuIsOpen = useSelector(
    (state: RootState) => state.navbar.hamburgerMenuIsOpen
  );

  const dispatch = useDispatch();

  return (
    <React.StrictMode>
      <nav>
        {hamburgerMenuIsOpen ? (
          <div className="flex justify-between p-5 xl:p-8">
            <h1 className="z-10 font-[600] text-5xl bg-transparent xl:text-6xl">
              <Link to={"/"} onClick={() => dispatch(setHamburgerMenuIsOpen())}>
                Moove
              </Link>
            </h1>
            <IoMdClose
              className="z-10 text-5xl bg-transparent cursor-pointer xl:text-6xl"
              onClick={() => dispatch(setHamburgerMenuIsOpen())}
            />
          </div>
        ) : (
          <div className="flex justify-between text-white p-5 xl:p-8">
            <h1 className="z-10 font-[600] text-5xl bg-transparent xl:text-6xl">
              <Link to={"/"} onClick={() => dispatch(setHamburgerMenuIsOpen())}>
                Moove
              </Link>
            </h1>
            <IoIosMenu
              className="z-10 text-5xl bg-transparent cursor-pointer xl:text-6xl"
              onClick={() => dispatch(setHamburgerMenuIsOpen())}
            />
          </div>
        )}
      </nav>
    </React.StrictMode>
  );
};

export default Navbar;
