import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "./navbar/navbarSlice";
import persistVehicleReducer from "./vehicle/vehicleSlice";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    navbar: NavbarReducer,
    vehicle: persistVehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
