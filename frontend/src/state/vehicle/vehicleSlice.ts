import { createSlice } from "@reduxjs/toolkit";
import { IVehicle } from "../../interface";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "vehicle",
  storage,
};

const initialState: IVehicle = {
  currentVehicle: 0,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setCurrentVehicle: (state, action) => {
      state.currentVehicle = action.payload;
    },
  },
});

export const { setCurrentVehicle } = vehicleSlice.actions;

const persistVehicleReducer = persistReducer(
  persistConfig,
  vehicleSlice.reducer
);

export default persistVehicleReducer;
