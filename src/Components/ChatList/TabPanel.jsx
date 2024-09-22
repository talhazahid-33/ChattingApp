import React, { useEffect } from "react";
import ChatRoom from "../Chat/chatRoom";
const TabPanelC = (props) => {
    const { children, value, index, roomid, ...other } = props;
    useEffect(()=>console.log("TP : ",props))
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
  