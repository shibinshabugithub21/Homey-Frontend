"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const storedWorkerId = localStorage.getItem("workerId");
    if (storedWorkerId) setWorkerId(storedWorkerId);

    if (!workerId) {
      console.warn("Worker ID is not set");
      return;
    }

    // Connect to the Socket.IO server
    const socketConnection = io(`${process.env.NEXT_PUBLIC_Backend_Port}`);
    setSocket(socketConnection);

    // Fetch chat users
    const fetchUsersForWorker = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getChatUsers/${workerId}`);
        setUsers(response.data.users); // Update users list
      } catch (error) {
        console.error("Error fetching users for worker:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersForWorker();

    return () => {
      socketConnection.disconnect();
    };
  }, [workerId]);

  // Join chat room when a user is selected
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    if (socket && user.chatId) {
      socket.emit("joinChat", user.chatId); // Join the chat room
    }

    fetchMessages(user.userId);
  };

  // Fetch messages for the selected chat
  const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/getMessages/${workerId}/${userId}`);
      const { messages, chatId } = response.data;
      setMessages(messages); // Update messages state
      setSelectedUser((prev) => ({
        ...prev,
        chatId, // Save chatId for further communication
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser?.chatId) return;

    const messageData = {
      senderId: workerId,
      receiverId: selectedUser.userId,
      message,
      timestamp: Date.now(),
    };

    // Send the message via Socket.IO
    socket.emit("sendMessage", {
      chatId: selectedUser.chatId,
      messageData,
    });

    // Optimistically update the chat UI
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
  };

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  return (
    <div className="flex h-screen bg-gray">
      {/* User List */}
      <div className="w-1/3 bg-white shadow-xl p-6 overflow-y-auto border-r border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
        {loadingUsers ? (
          <p className="text-gray-400">Loading users...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.userId}
                className="p-3 mb-2 bg-gray-100 rounded-md cursor-pointer hover:bg-green-50 hover:shadow-md transition-all duration-200"
                onClick={() => handleSelectUser(user)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6 bg-white shadow-xl">
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          {selectedUser ? selectedUser.name : "Select a User"}
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto space-y-4 mb-4">
          {loadingMessages ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId === workerId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-lg shadow-md ${
                    msg.senderId === workerId
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
          )}
        </div>

        {/* Message Input */}
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
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
