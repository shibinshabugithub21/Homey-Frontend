"use client";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = useRef(null);
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for users
  let userId = localStorage.getItem("userId");
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages

  const fetchUsersForWorker = async () => {
    setLoadingUsers(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_Backend_Port}/getWorkerDetail/${userId}`
      );

      setUsers(response.data.users); // Update users list
    } catch (error) {
      console.error("Error fetching users for worker:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsersForWorker();
  }, [userId]);

  const fetchMessages = async (userID) => {
    console.log(userID, userId);
    
    setLoadingMessages(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getMessages/${workerId=userID}/${userId=userId}`);
      const { messages, chatId } = response.data;
console.log('messages',messages);

      setMessages(messages); // Update messages state
      setSelectedUser((prev) => ({
        ...prev,
        chatId, // Set chatId from response
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.userId);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.warn("Message is empty, cannot send.");
      return;
    }

    if (!selectedUser || !selectedUser.chatId) {
      console.warn("No user selected or chatId missing.");
      return;
    }

    const payload = {
      senderId: workerId,
      chatId: selectedUser.chatId, // Use the chatId from selectedUser
      message,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/createMessage`, payload);
      if (response.data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "worker",
            receiverId: selectedUser.userId,
            message,
            timestamp: Date.now(),
          },
        ]);
        setMessage("");
      }
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error?.response?.data || error?.message);
    }
  };
  return (
    <div className="flex max-w-full mx-auto shadow-lg rounded-lg h-full">
      {/* Left side user list */}
      <div className="w-64 bg-gray-100 p-4 space-y-6 border-r border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        {loadingUsers ? (
          <p className="text-gray-400">Loading users...</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.userId}
                className={`p-2 bg-gray-100 rounded-md cursor-pointer text-sm font-medium hover:bg-indigo-100 hover:shadow transition-all duration-200 ${
                  selectedUser?.userId === user.userId
                    ? "bg-indigo-200"
                    : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat area */}
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-6 bg-white shadow-xl">
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          {selectedUser ? selectedUser.name : "Select a User"}
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto space-y-4 mb-4">
          {loadingMessages ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : (


            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-lg shadow-md ${
                    msg.senderId === userId
                      ? "bg-blue-200 text-gray-800 rounded-r-lg"
                      : "bg-green-200 text-gray-800 rounded-l-lg"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
            


          )
          
          
          }
        </div>

        {/* Message Input Area */}
        <div className="flex items-center mt-auto border-t border-gray-200 pt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none transition-colors duration-200"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
