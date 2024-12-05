import React, { useState } from "react";
import useStore from "@/app/store/useStore"; // Zustand store for notifications
import ChatComponent from "@/components/Chatt/ChatCompoment"; // Chat component

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control modal visibility
  const { chatNotifications, resetChatNotifications } = useStore(); // Accessing Zustand store for notifications

  // Function to toggle the chat modal
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle the modal visibility
    if (chatNotifications > 0) {
      resetChatNotifications(); // Reset notifications when opening the chat
    }
  };

  return (
    <div className="relative">
      {/* Chat Button */}
      <button
        onClick={toggleChat} // Trigger modal opening/closing
        className="fixed bottom-8 right-8 bg- text-white py-3 px-6 rounded-full shadow-lg flex items-center justify-center space-x-2 z-20"
      >
        <span>Chat with Us</span>
        {chatNotifications > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {chatNotifications}
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-80 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={toggleChat} // Close the modal
              className="absolute top-2 right-2 text-gray-500"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Chat Component */}
            <ChatComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
