import React from 'react';
import './chatList.css';  // Import the CSS file

const ChatUsersList = ({ usernames, onButtonClick }) => {
    const usernamess = ["Hamza","Anas","Asad","Talha"];
  return (
    <div className="user-list-container">
      <div className="user-list">
        {usernamess.map((username, index) => (
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
