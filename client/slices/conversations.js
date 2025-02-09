import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversations: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = Array.isArray(action.payload) ? action.payload : [];
    },
    setSelectedConversations: (state, action) => {
      state.selectedConversations = { ...action.payload };
    },
  },
});

export default conversationSlice.reducer;
export const { setConversations, setSelectedConversations } =
  conversationSlice.actions;
