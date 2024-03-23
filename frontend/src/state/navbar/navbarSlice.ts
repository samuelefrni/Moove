import { createSlice } from "@reduxjs/toolkit";
import { INavbar } from "../../interface";

const initialState: INavbar = {
  hamburgerMenuIsOpen: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setHamburgerMenuIsOpen: (state) => {
      state.hamburgerMenuIsOpen = !state.hamburgerMenuIsOpen;
    },
  },
});

export const { setHamburgerMenuIsOpen } = navbarSlice.actions;

export default navbarSlice.reducer;
