import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import adminSlice from "./AdminSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
});

export default store;
