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
      return { ...state, conversations: [...action.payload] };
    },
    setSelectedConversations: (state, action) => {
      return { ...state, selectedConversations: { ...action.payload } };
    },
  },
});

export default conversationSlice.reducer;
export const { setConversations, setSelectedConversations } =
  conversationSlice.actions;
