import { Dispatch, SetStateAction } from "react";

export interface INavbar {
  hamburgerMenuIsOpen: boolean;
  setHamburgerMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IHamburgerMenu {
  hamburgerMenuIsOpen: boolean;
  setHamburgerMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}
