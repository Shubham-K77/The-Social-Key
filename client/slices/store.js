import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeToggler";
import userSlice from "./userInfo";
const store = configureStore({
  reducer: {
    themeToggler: themeSlice,
    user: userSlice,
  },
});

export default store;
