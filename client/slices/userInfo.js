import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userInfo: {},
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = {}; //Reset The State
    },
  },
});

export default userSlice.reducer;
export const { setUserInfo, clearUserInfo } = userSlice.actions;
