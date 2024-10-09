import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatUsers: [],
};

const ChatUsers = createSlice({
  name: "chatUsers",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newRoom = action.payload;
      state.rooms.push(newRoom);
    },
    
  },
});

export default ChatUsers.reducer;
