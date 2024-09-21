import React from 'react';
import './chatList.css'; 

const ChatTile = ({ username, lastMessage, time }) => {
  return (
    
    <div className="chat-tile">
      <div className="chat-info">
        <h4>{username}</h4>
        <p>{lastMessage}</p>
      </div>
      <div className="chat-time">
        <small>{time}</small>
      </div>
    </div>
  );
};

export default ChatTile;
