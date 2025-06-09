import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { recieveMessageRoute, sendMessageRoute , getChannelMessage, sendChannelMessage, fileUploadRoute} from "../../utils/routes";
import { useSocket } from "../../context/SocketContext.jsx";


export default function ChatContainer({ currentChat, currentUser, channelChat }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        const token = user?.token;
        if (!token || !currentChat) return;

        const response = await axios.post(
         channelChat?getChannelMessage: recieveMessageRoute,
          { id: channelChat? null: currentChat._id,
            channelId: channelChat ? currentChat._id : null, 
            // channelId: currentChat._id 
           },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data = await response.data;
        if (!data) {
          console.error("No data received from the server.");
          return;
        }
        if (channelChat) setMessages(data);
        else setMessages(data.messages || []); 
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [channelChat, currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMsg = async (msg, url) => {


  try {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    const token = user?.token;

    if (!token || !currentChat) {
      console.error("User token or current chat is not available.");
      return;
    }

    let fileURL=null;
    if (url instanceof File) {
      const formData = new FormData();
      formData.append("url", url); 

      const response = await axios.post(fileUploadRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
       fileURL = data.url;
      console.log("Uploaded file URL:", fileURL);
    }


   


   

     const messagePayLoad={
      channelId: channelChat ? currentChat._id : null,

      recipient:channelChat? null: currentChat._id,
      sender: currentUser._id,
      content: msg || "",
      fileUrl: fileURL,
      messageType:fileURL?"file": "text",

    }
    console.log("Message payload:", messagePayLoad);
    if (socket && socket.current) {
      if(channelChat){
        socket.current.emit("send-channel-message", messagePayLoad);
      }else{

  socket.current.emit("send-message", messagePayLoad);
      }
} else {
  console.error("Socket not initialized. Message not sent.");
}

    

  } catch (error) {
    console.error("Error sending message:", error);
  }
};

useEffect(() => {

  const handleReceiveMessage = (message) => {

    if (channelChat) {
      if (message.channelId === currentChat._id) {
        setMessages((prev) => [...prev, message]);
        console.log("Received channel message:", message);
      }
      
    } else {
      if (
        message.sender === currentChat._id ||
        message.recipient === currentChat._id
      ) {
        setMessages((prev) => [...prev, message]);
        console.log("Received message:", message);
      }
    }
  };
  if(!channelChat){
  socket.current.on("receiveMessage", handleReceiveMessage);}
  else{
  socket.current.on("receiveChannelMessage", handleReceiveMessage);
}

  return () => {
     if(!channelChat){
    socket.current.off("receiveMessage", handleReceiveMessage);}
    else{
    socket.current.off("receiveChannelMessage", handleReceiveMessage);
    }
   
  }

 
}, [socket, socket.current, currentChat, channelChat]);





 return (
  <div className="flex flex-col h-full w-full bg-white shadow-md rounded-2xl overflow-hidden">
    {/* Chat Header */}
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b">
      <div className="flex items-center gap-3">
        {/* Optional: Avatar or Channel Icon */}
        <div className="w-10 h-10 flex items-center justify-center bg-blue-400 rounded-full text-lg font-bold">
          {channelChat
            ? (currentChat?.name?.[0] || "C")
            : (currentChat?.firstName?.[0] || "U")}
        </div>
        <div>
          {channelChat ? (
            <h3 className="text-lg font-semibold">{currentChat?.name || "Channel"}</h3>
          ) : (
            <>
              <h3 className="text-base font-semibold">
                {currentChat?.firstName || "User"} {currentChat?.lastName || ""}
              </h3>
              <p className="text-xs text-blue-100">{currentChat?.email}</p>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-blue-50 space-y-2">
      {messages.length > 0 ? (
        messages.map((message, index) => {
          const senderId = channelChat ? message.sender?._id : message.sender;
          const isMe = senderId === currentUser._id;
          return (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? scrollRef : null}
              className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar for other users */}
              {!isMe && (
                <div className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full text-sm font-bold mr-2">
                  {message.sender?.firstName?.[0] || "U"}
                </div>
              )}
              <div
                className={`relative max-w-xs px-4 py-2 rounded-2xl text-sm shadow
                  ${isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
              >
                {/* Sender name for group/channel */}
                {!isMe && channelChat && (
                  <div className="mb-1 text-xs font-medium text-blue-700">
                    {message.sender?.firstName} {message.sender?.lastName}
                  </div>
                )}

                {/* File attachment */}
                {message.fileUrl && (
                  <div className="mb-2">
                    {/\.(jpg|jpeg|png|gif)$/i.test(message.fileUrl) ? (
                      <img
                        src={`http://localhost:8747/${message.fileUrl}`}
                        alt="sent file"
                        className="max-w-[180px] rounded-md border"
                      />
                    ) : (
                      <a
                        href={`http://localhost:8747/${message.fileUrl}`}
                        download
                        target="_blank"
                        
                        
                        rel="noopener noreferrer"
                        className="text-white-600 underline flex items-center gap-1"
                      >
                        <span role="img" aria-label="file">📄</span>
                        {message.fileUrl?.split("uploads/files/")[1]}
                      </a>
                    )}
                  </div>
                )}

                {/* Message content */}
                <div>{message.content}</div>

                {/* Timestamp */}
                <div className={`absolute -bottom-5 right-2 text-[10px] text-gray-400`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {/* Avatar for self (optional, usually omitted) */}
              {isMe && (
                <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-full text-sm font-bold ml-2">
                  {currentUser?.firstName?.[0] || "M"}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No messages yet.</p>
      )}
    </div>

    {/* Chat Input */}
    <div className="border-t bg-white p-4">
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  </div>
);
}