import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeToggler";
import userSlice from "./userInfo";
import conversationSlice from "./conversations";
const store = configureStore({
  reducer: {
    themeToggler: themeSlice,
    user: userSlice,
    conversation: conversationSlice,
  },
});

export default store;
