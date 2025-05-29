import React from "react";

const NotificationLine=({notification,onRead,acceptFollow,rejectFollow})=>{
    
    const followRequestResponse=async()=>{
        
    }
    
    
    return (
        <div  key={notification.id} className={`notification-message-${notification.status}`} onClick={()=>onRead(notification.id)}>
                     <b>{notification.actinguser} </b> {notification.message}
                        {notification.action==="follow-request" && 
            <div style={{"display":"flex","gap":"10px"}}>
            
                <span style={{backgroundColor:"green",color:"wheat",borderRadius:"3px",padding:"4px"}} onClick={()=>acceptFollow(notification)}>Accept</span>
                <span style={{backgroundColor:"red",color:"wheat",borderRadius:"3px",padding:"4px"}} onClick={()=>rejectFollow(notification)}> Reject</span>
            </div>}
        
        </div>
    )
}


export default NotificationLine;