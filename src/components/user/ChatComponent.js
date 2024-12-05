import React, { useEffect, useState } from 'react';
import useChatStore from './chatStore';
import { formatDistanceToNow } from 'date-fns';

const ChatComponent = ({ currentUser, selectedUser, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  
  const { messages, initializeSocket, sendMessage, resetMessages } = useChatStore();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get your auth token
    const newSocket = io(`${process.env.NEXT_PUBLIC_Backend_Port}/chat`, {
      auth: { token } // Pass token for server verification
    });
    setSocket(newSocket);
  
    // Join room and handle cleanup
    newSocket.emit('joinRoom', { userId: currentUser.id, workerId: selectedUser.id });
  
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id, selectedUser.id]);
  

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        text: inputMessage,
        senderId: currentUser.id,
        recipientId: selectedUser.id,
        timestamp: new Date(),
      };
      sendMessage(message); 
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center">
            <img src="/path/to/user-avatar.jpg" alt="User avatar" className="w-8 h-8 rounded-full mr-2" />
            <h2 className="text-lg font-semibold">Chat with {selectedUser.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500">X</button>
        </div>

        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs rounded-lg p-2 mb-2" style={{ backgroundColor: msg.senderId === currentUser.id ? '#3b82f6' : '#e5e7eb' }}>
                <p className={`text-sm ${msg.senderId === currentUser.id ? 'text-white' : 'text-black'}`}>
                  {msg.text}
                </p>
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center p-2 border-t">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="border rounded-full px-4 py-2 flex-grow mr-2"
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-full">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
