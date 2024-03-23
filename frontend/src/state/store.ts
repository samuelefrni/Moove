import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "./navbar/navbarSlice";

export const store = configureStore({
  reducer: {
    navbar: NavbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
