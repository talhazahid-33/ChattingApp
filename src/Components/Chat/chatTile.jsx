import React from 'react';
import './chat.css'; // Import the CSS file

const ChatMessage = (props) => {
  return (
    <div key={props.index} className={`chat-container ${props.alignReverse ? 'row-reverse' : ''}`}>
      <div className="upper-division">
        <span className="email">{props.username}</span>
        <span className="time">{props.time}</span>
      </div>
      
      <div className="lower-division">
        <p className='p'>{props.message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
