import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatMessage from "./chatTile";
import socket from "../../Pages/sockets";
import { v4 as uuid } from "uuid";

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [image, setImage] = useState(null);
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
    console.log("CR : ", props);
    getMessages();
  }, [props.roomid]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("receiving socket Message ", data);

      if (data.roomId == props.roomid) {
        console.log("Calling Update Seen")
        socket.emit("update_seen",{roomId:props.roomid, messageId: data.messageId});
        setMessages((prevMessages) => [...prevMessages, data]);
      } else console.log("Message belongs to room ", data.roomId);
    };

    const handleSeenUpdate = (data) => {
      console.log("handleSeenUpdate ",data);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.messageId == data.messageId ? { ...message, seen: true } : message
        )
      );
    };

    const handleSeenUpdateForAll = (data) =>{
      console.log("Handle seen update for All",data);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.sender !== data.username ? { ...message, seen: true } : message
        )
      );

    }

    socket.on("receive_message", handleReceiveMessage);
    socket.on("listen_seen_update", handleSeenUpdate);
    socket.on("listen_update_seen_for_all",handleSeenUpdateForAll);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("listen_seen_update", handleSeenUpdate);
      socket.off("listen_update_seen_for_all",handleSeenUpdateForAll);
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
  const updateSeen = async (messageId) => {
    console.log("Update Seen R ", messageId);
    try {
      const result = await axios.post("http://localhost:8000/updateseen", {
        messageId: messageId,
      });
      if (result.status === 200) console.log("Seen status updated");
      else console.log("DB error occured in seen update");
    } catch (error) {
      console.log(error);
    }
  };
  const saveMessage = async (newMessage) => {
    try {
      const result = await axios.post("http://localhost:8000/savemessage", newMessage);
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
      messageId:uuid(),
      sender: username,
      seen: false,
      roomId: props.roomid,
      message: message,
      time: time,
    };
    try {
      socket.emit("send_message", {
        roomId: props.roomid,
        message: newMessage,
      });
      setMessages((prevMsgs) => [...prevMsgs, newMessage]);
      saveMessage(newMessage);
      setMessage("");
    } catch (error) {
      console.log("Error sending Message");
    }
  };
  const getRoomsList = () => {
    socket.emit("get_rooms");

    return () => {
      socket.off("rooms_list");
    };
  };

  const getMessages = async () => {
    try {
      console.log("Passig ID ", props.roomid);
      const result = await axios.post("http://localhost:8000/getmessages", {
        roomId: props.roomid,
      });
      if (result.status === 200) {
        setMessages(result.data.data);
        socket.emit("update_seen_for_all",{username:username, roomId:props.roomid})
      } else {
        console.log("Error receiving Messages");
      }
    } catch (error) {}
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSend = () => {
    if (image) {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
        formData.append("roomId", props.roomId);
      }

      socket.emit("send_image", formData);
      setImage(null);
    }
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
            seen={msg.seen}
            alignReverse={username === msg.sender}
          />
        ))}

        <br />
      </div>
      <div className="chat-send-message">
        <div className="input-message-div">
          <input
            className="enter-message"
            type="text"
            placeholder="Type Something "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={handleImageSend}>Send Image</button>
        </div>
        <br />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
        {/*<button onClick={getRoomsList}>Check Rooms </button>*/}
      </div>
    </div>
  );
};

export default ChatRoom;
