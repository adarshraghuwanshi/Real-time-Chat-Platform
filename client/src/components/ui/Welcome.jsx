import React, { useState, useEffect } from "react";

export default function Welcome() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    if (user && user.firstName) {
      setUserName(user.firstName);
    } else {
      setUserName("Guest");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome, <span className="text-black">{userName}!</span>
      </h1>
      <h3 className="text-lg text-gray-600">
        Please select a chat to start messaging.
      </h3>
      <img
        src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
        alt="Chat Illustration"
        className="w-40 mt-6 opacity-80"
      />
    </div>
  );
}
