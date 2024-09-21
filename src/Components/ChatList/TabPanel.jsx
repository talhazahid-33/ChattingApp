import React, { useEffect, useState } from "react";
import ChatRoom from "../Chat/chatRoom";
const TabPanelC = (props) => {
    const { children, value, index, roomid, ...other } = props;
   
    if (!roomid) {
      return <></>; 
    }
  
    return (
      <div
        role="tabpanel"
        hidden={false}
        id={`vertical-tabpanel-${index}`}
      >
        <ChatRoom roomid={roomid} />
      </div>
    );
  };
  
  export default TabPanelC;
  