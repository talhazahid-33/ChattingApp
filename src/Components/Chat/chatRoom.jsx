import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatMessage from "./chatTile";
import socket from "../../Pages/sockets";

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    getMessages();
  }, [props.roomid]);



  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("receiving socket Message ", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return now.toLocaleTimeString("en-US", options);
  };
  const saveMessage = async () => {
    try {
      const result = await axios.post("http://localhost:8000/savemessage", {
        roomId: props.roomid,
        time: getCurrentTime(),
        sender: username,
        seen: false,
        message: message,
      });
      if (result.status === 200) {
        console.log("Message Saved");
      } else {
        console.log("Error Saving Messages");
      }
    } catch (error) {}
  };
  const sendMessage = async () => {
    const time = getCurrentTime();
    const newMessage = {
      sender: username,
      seen: false,
      roomId: props.roomid,
      message: message,
      time: time,
    };
    try {
      socket.emit("send_message", {
        roomId:props.roomid,
        message:newMessage
      });
      setMessages((prevMsgs) => [
        ...prevMsgs,
        newMessage
      ]);
      await saveMessage();
      setMessage("");
    } catch (error) {
      console.log("Error sending Message");
    }
  };
  const getRoomsList = ()=>{
    
    socket.emit("get_rooms");

    // Request joined rooms
    socket.emit("get_rooms");

    return () => {
      socket.off("rooms_list");
    };
  }

  const getMessages = async () => {
    try {
      console.log("Passig ID ", props.roomid);
      const result = await axios.post("http://localhost:8000/getmessages", {
        roomId: props.roomid,
      });
      if (result.status === 200) {
        console.log("Received Message : ", result.data.data);
        setMessages(result.data.data);
      } else {
        console.log("Error receiving Messages");
      }
    } catch (error) {}
  };

  return (
    <div style={{ flex: 1, width: "70vw" }}>
      <div className="chat-parent-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            username={msg.sender}
            time={msg.time}
            message={msg.message}
            alignReverse={username === msg.sender}
          />
        ))}

        <br />
      </div>
      <div className="chat-send-message">
        <div >
        <input
          className="enter-message"
          type="text"
          placeholder="Type Something "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
        </div>
        <br />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
        <button onClick={getRoomsList}>Check Rooms </button>
      </div>
    </div>
  );
};

export default ChatRoom;
