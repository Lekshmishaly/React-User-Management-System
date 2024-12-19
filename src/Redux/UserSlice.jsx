import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDatas: localStorage.getItem("userdata")
      ? JSON.parse(localStorage.getItem("userdata"))
      : null,
  },
  reducers: {
    addUser: (state, action) => {
      state.userDatas = action.payload;
      localStorage.setItem("userdata", JSON.stringify(action.payload));
    },
    logoutUser: (state, action) => {
      state.userDatas = null;
      localStorage.removeItem("userdata");
    },
  },
});

export const { addUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
