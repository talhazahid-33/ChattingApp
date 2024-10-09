import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [
    {
      roomId: "",
      lastMessage: "",
      chatUsers: [],
      messages: [
        {
          messageId: "",
          roomId: "",
          sender: "",
          seen: false,
          time: "",
          message: "",
        },
      ],
    },
  ],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    addRoom: (state, action) => {
      const newRoom = action.payload;
      state.rooms.push(newRoom);
    },
    addMessageToRoom: (state, action) => {
      const { roomId, message } = action.payload;
      const room = state.rooms.find((room) => room.roomId === roomId);

      if (room) {
        room.messages.push(message);
      }
    },
    updateLastMessage: (state, action) => {
      const { roomId, lastMessage } = action.payload;
      const room = state.rooms.find((room) => room.roomId === roomId);
      if (room) {
        room.lastMessage = lastMessage;
      }
    },
    updateSeen: (state, action) => {
      const { messageId, roomId, username } = action.payload;
      const room = state.rooms.find((room) => room.roomId === roomId);
      const msg = room.messages.find((msg) => msg.messageId === messageId);
      if (msg) {
        msg.seen = true;
      }
    },
    populateRooms: (state, action) => {
      console.log("Populate Rooms , ", action.payload);
      const { rooms } = action.payload;
      state.rooms = rooms.map((room) => ({
        roomId: room.roomId,
        lastMessage: room.lastMessage,
        chatUsers: room.usernames || [],
        messages: [],
      }));
      console.log("rooms ppop : ",state.rooms);
    },
    addMessagesToRoom: (state, action) => {},
  },
});

export const selectChatUsersByRoomId = (state, roomId) => {
    const room = state.rooms.find((room) => room.roomId === roomId); //
    return room ? room.chatUsers : []; 
  }
  

export const {
  addRoom,
  addMessageToRoom,
  updateLastMessage,
  updateSeen,
  populateRooms,
  printRooms,
} = roomSlice.actions;
export default roomSlice.reducer;
