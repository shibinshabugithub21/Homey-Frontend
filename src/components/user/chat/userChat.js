"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Clock, UserCircle } from "lucide-react";
import io from "socket.io-client"; // Import socket.io-client

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = useRef(null); // Create a socket reference
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  let userId = localStorage.getItem("userId");
  let [workerId, setWorkerId] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_Backend_Port);

    socket.current.on('message', (messageData) => {
      if (messageData.chatId === selectedUser?.chatId) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [selectedUser]);

  const fetchUsersForWorker = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Port}/getWorkerDetail/${userId}`
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsersForWorker();
  }, [userId]);

  const fetchMessages = async (userID) => {
    setLoadingMessages(true);
    setWorkerId(userID);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Port}/worker/getMessages/${userID}/${userId}`
      );
      const data = await response.json();
      const { messages, chatId } = data;
      setMessages(messages);
      setSelectedUser((prev) => ({ ...prev, chatId }));
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
    if (!message.trim() || !selectedUser?.chatId) return;

    const payload = {
      senderId: userId,
      chatId: selectedUser.chatId,
      message,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Port}/worker/createMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.success) {
        // Send the message via socket
        socket.current.emit('sendMessage', payload);
        setMessages((prev) => [
          ...prev,
          {
            senderId: userId,
            receiverId: userId,
            message,
            timestamp: Date.now(),
          },
        ]);
        setMessage("");
      }
      fetchMessages(selectedUser.userId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {loadingUsers ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {users.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-102 ${
                    selectedUser?.userId === user.userId
                      ? "bg-indigo-50 border-l-4 border-indigo-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <UserCircle className="w-10 h-10 text-gray-400" />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">Click to chat</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
          {selectedUser ? (
            <div className="flex items-center">
              <UserCircle className="w-8 h-8 text-gray-400" />
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-gray-800">
              Select a conversation
            </h2>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl px-4 py-2 rounded-lg shadow-sm ${
                      msg.senderId === userId
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <div className="flex items-center mt-1 space-x-1">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-300">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedUser || !message.trim()}
              className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;