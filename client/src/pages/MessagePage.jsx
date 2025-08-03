import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MessageInbox from "../components/Deloper/MessageInbox";
import MessageChat from "../components/Deloper/MessageChat";

const MessagePage = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ✅ Update state when path changes
  useEffect(() => {
    setIsChatOpen(location.pathname !== "/message");
  }, [location.pathname]);

  return (
    <div className="flex flex-1 h-screen bg-black">
      {/* Left Sidebar (Inbox) */}
      <div
        className={`w-full border-r border-[0.1px] border-[#2f2f2f] md:w-1/3 ${
          isChatOpen ? "hidden md:block" : ""
        }`}
      >
        <MessageInbox />
      </div>

      {/* Right Chat Area */}
      <div className="flex-1">
        <Routes>
          <Route
            path=":id"
            element={<MessageChat setIsChatOpen={setIsChatOpen} />}
          />
        </Routes>
        {!isChatOpen && (
          <div className="md:flex hidden flex-col justify-center items-center w-full h-full text-center">
            <div className="text-3xl font-semibold mb-2">Your messages</div>
            <p className="text-gray-500">
              Send private messages or start a group.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
