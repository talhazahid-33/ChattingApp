import React, { useEffect, useState } from "react";
import ChatTab from "../Components/ChatTab";
import socket from "./sockets";

const Chat = () => {
  const [roomId, setRoomID] = useState();
  const username = localStorage.getItem("username");
  useEffect(()=>{
    socket.emit("selfroom",username);
  },[])
  
  return (
    <div className="chat-page">
        <div>

        </div>
      <div>
        <ChatTab />
      </div>
    </div>
  );
};

export default Chat;
