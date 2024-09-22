import React, { useEffect } from 'react';
import './chatList.css';  // Import the CSS file

const   ChatUsersList = ({ usernames,room, onButtonClick }) => {
  useEffect(()=>{
    console.log("UL ",room);
  },[])
  return (
    <div className="user-list-container">
      <div className="user-list">
        {usernames.map((username, index) => (
          <div key={index} className="username-item">
            {username}
          </div>
        ))}
      </div>
      <button onClick={onButtonClick} className="action-button">
        Action
      </button>
    </div>
  );
};

export default ChatUsersList;
