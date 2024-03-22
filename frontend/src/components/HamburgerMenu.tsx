import React, { useState } from "react";

import Navbar from "./Navbar";
import { IHamburgerMenu } from "../interface";

const HamburgerMenu: React.FC<IHamburgerMenu> = ({
  hamburgerMenuIsOpen,
  setHamburgerMenuIsOpen,
}) => {
  const [expandItem, setExpandItem] = useState<string | null>();

  const handleExpand = (itemName: string) => {
    if (expandItem == itemName) {
      setExpandItem(null);
    } else {
      setExpandItem(itemName);
    }
  };

  return (
    <React.StrictMode>
      <div>
        <Navbar
          hamburgerMenuIsOpen={hamburgerMenuIsOpen}
          setHamburgerMenuIsOpen={setHamburgerMenuIsOpen}
        />
        <ul className="border border-solid border-black flex flex-col px-10 font-[600] min-h-[600px] bg-white">
          <li className="text-3xl p-3">
            <div className="flex">
              <span className="">Su di noi</span>
              <button
                className="ml-auto"
                onClick={() => handleExpand("Su di noi")}
              >
                ↓
              </button>
            </div>
            {expandItem == "Su di noi" && (
              <p className="text-sm text-justify font-[400]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                sint, rerum corrupti soluta tenetur autem, modi molestiae
                numquam quibusdam tempore nemo voluptatem debitis
                necessitatibus! Officia odit ut debitis adipisci provident!
              </p>
            )}
          </li>
          <li className="text-3xl p-3">
            <div className="flex">
              <span className="">Perchè Moove</span>
              <button
                className="ml-auto"
                onClick={() => handleExpand("Perchè Moove")}
              >
                ↓
              </button>
            </div>
            {expandItem == "Perchè Moove" && (
              <p className="text-sm text-justify font-[400]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                sint, rerum corrupti soluta tenetur autem, modi molestiae
                numquam quibusdam tempore nemo voluptatem debitis
                necessitatibus! Officia odit ut debitis adipisci provident!
              </p>
            )}
          </li>
          <li className="text-3xl p-3">
            <div className="flex">
              <span className="">Veicoli</span>
              <button
                className="ml-auto"
                onClick={() => handleExpand("Veicoli")}
              >
                ↓
              </button>
            </div>
            {expandItem == "Veicoli" && (
              <p className="text-sm text-justify font-[400]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                sint, rerum corrupti soluta tenetur autem, modi molestiae
                numquam quibusdam tempore nemo voluptatem debitis
                necessitatibus! Officia odit ut debitis adipisci provident!
              </p>
            )}
          </li>
          <li className="text-3xl p-3">
            <div className="flex">
              <span className="">Locations</span>
              <button
                className="ml-auto"
                onClick={() => handleExpand("Locations")}
              >
                ↓
              </button>
            </div>
            {expandItem == "Locations" && (
              <p className="text-sm text-justify font-[400]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                sint, rerum corrupti soluta tenetur autem, modi molestiae
                numquam quibusdam tempore nemo voluptatem debitis
                necessitatibus! Officia odit ut debitis adipisci provident!
              </p>
            )}
          </li>
          <li className="text-3xl p-3">
            <div className="flex">
              <span className="">Download App</span>
              <button
                className="ml-auto"
                onClick={() => handleExpand("Download App")}
              >
                ↓
              </button>
            </div>
            {expandItem == "Download App" && (
              <p className="text-sm text-justify font-[400]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                sint, rerum corrupti soluta tenetur autem, modi molestiae
                numquam quibusdam tempore nemo voluptatem debitis
                necessitatibus! Officia odit ut debitis adipisci provident!
              </p>
            )}
          </li>
        </ul>
      </div>
    </React.StrictMode>
  );
};

export default HamburgerMenu;
