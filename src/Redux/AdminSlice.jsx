import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminDatas: localStorage.getItem("adminData")
      ? JSON.parse(localStorage.getItem("adminData"))
      : null,
  },
  reducers: {
    addAdmin: (state, action) => {
      state.adminDatas = action.payload;
      localStorage.setItem("adminData", JSON.stringify(action.payload));
    },
    logoutAdmin: (state, action) => {
      state.adminDatas = null;
      localStorage.removeItem("adminData");
    },
  },
});

export const { addAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
