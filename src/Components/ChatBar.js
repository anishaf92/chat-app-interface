import React from 'react';
import "./style.css"

const ChatBar = ({userList}) => {
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        {console.log(userList)}
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
         
         {userList}
        
        </div>
      </div>
    </div>
  );
};

export default ChatBar;