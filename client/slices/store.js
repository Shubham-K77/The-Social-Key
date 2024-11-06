import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeToggler";
const store = configureStore({
  reducer: {
    themeToggler: themeSlice,
  },
});

export default store;
