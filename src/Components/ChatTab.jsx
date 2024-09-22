import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ChatTile from "./ChatList/Tile";
import axios from "axios";
import TabPanelC from "./ChatList/TabPanel";
import RoomCreation from "./ChatList/usersDialog";
import ChatUsersList from "./ChatList/ChatUsers";
import socket from "../Pages/sockets";
import { useEffect } from "react";

export default function ChatTab() {
  const [value, setValue] = React.useState(0);
  const [rooms, setRooms] = React.useState([]);
  const [roomID, setRoomID] = useState();
  const [usernames, setUsernames] = useState([]);
  const [roomUsernames,setRoomUsernames] = useState([]);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const handleChange = (event, newValue) => {
    console.log("change ",newValue);
    setRoomID(() => rooms[newValue].roomId);
    console.log("rooms 0 : ",rooms[0].usernames)
    setValue(newValue);
    setRoomUsernames(rooms[newValue].usernames);
  };

  const createRoom = async (username2) => {
    if(!username2)
      return;
    try {
      const result = await axios.post("http://localhost:8000/createroom", {
        username1: username,
        username2: username2,
      });
      if (result.status === 200) {
        const roomId = result.data.roomId;
        console.log("New Room Inserted");
        const newRoom = {
          roomId: roomId,
          lastMessage: "",
          usernames: [username, username2],
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        socket.emit("create_room", newRoom);
      } else {
        console.log("Error creating room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRooms = async () => {
    console.log("Get Rooms");
    try {
      const result = await axios.post("http://localhost:8000/getrooms", {
        username: username,
      });
      if (result.status === 200) {
        console.log("rooms ", result.data.data);
        setRooms(result.data.data);
      } else {
        console.log("Error getting rooms");
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUsernames = async () => {
    try {
      const result = await axios.get("http://localhost:8000/getallusers");
      if (result.status === 200) {
        setUsernames(removeOwnUsername(result.data.data));
      } else {
        console.log("Error getting users");
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  function removeOwnUsername(usernames) {
    return usernames.filter((user) => user !== username);
  }

  React.useEffect(() => {
    getUsernames();
    getRooms();
  }, []);

  useEffect(() => {
    const handleInvitation = (data) => {
      console.log("Invitation Received", data);

      socket.emit("join_room", data.roomId);
      setRooms((prevRooms) => [...prevRooms, data]);
    };

    socket.on("invite_to_room", handleInvitation);

    return () => {
      socket.off("invite_to_room", handleInvitation);
      socket.off("join_room");
      socket.off("self_room");
    };
  }, [rooms]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1, width: "30vw" }}>
          <RoomCreation
            className="create-room"
            usernames={usernames}
            createRoom={createRoom}
          />
        </div>
        <ChatUsersList room={rooms} usernames={!rooms ? [] :  roomUsernames}/>
      </div>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: 600,
        }}
      >
        <Tabs
          className="tab-width"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {rooms.map((room, index) => (
            <Tab
              key={index}
              sx={{ maxWidth: "100%" }}
              label={
                <ChatTile
                  username={room.usernames}
                  lastMessage={room.lastMessage}
                  time={room.roomId}
                />
              }
            />
          ))}
        </Tabs>

        <TabPanelC value={value} roomid={roomID}></TabPanelC>
      </Box>
    </div>
  );
}
