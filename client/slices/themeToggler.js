import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  theme: "light",
};
const themeSlice = createSlice({
  name: "themeToggler",
  initialState,
  reducers: {
    colorChanger: (state) => {
      state.theme === "light"
        ? (state.theme = "dark")
        : (state.theme = "light");
    },
  },
});

export default themeSlice.reducer;
export const { colorChanger } = themeSlice.actions;
