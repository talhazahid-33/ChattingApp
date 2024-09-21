import React from 'react';
import ChatTile from './Tile';

const ChatList = () => {
  const users = [
    {
      username: 'John Doe',
      lastMessage: 'Hey! How are you?',
      time: '10:30 AM',
    },
    {
      username: 'Jane Smith',
      lastMessage: 'See you tomorrow!',
      time: '9:15 AM',
    },
    {
      username: 'Alex Johnson',
      lastMessage: 'Meeting at 5?',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="chat-list">
      {users.map((user, index) => (
        <ChatTile
          key={index}
          username={user.username}
          lastMessage={user.lastMessage}
          time={user.time}
        />
      ))}
    </div>
  );
};

export default ChatList;
