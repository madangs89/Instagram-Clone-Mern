import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMessage,
  getAllConversationAndGroup,
} from "../../Redux/Services/MessageThunk";
import { Check } from "lucide-react";

import {
  updateCurrentUserMessage,
  updateUpSideDownTheAllConversationsAndGroups,
  updatingStatusForMessages,
} from "../../Redux/Slice/MessageSlice";
import { toast } from "sonner";
import Loader from "./Loader";

const ShareDialog = ({ onClose, post, sendingData }) => {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.message.allConversationsAndGroups);
  const handleSelectUser = (conversationId, userId) => {
    const users = [...selectedUsersId];
    const findIndex = users.findIndex(
      (item) =>
        item?.conversationId === conversationId && item?.userId === userId
    );
    if (findIndex === -1) {
      users.push({ conversationId, userId });
    } else {
      // Remove from selectedUsersId
      users.splice(findIndex, 1);
    }
    setSelectedUsersId(users);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  // Filtered list
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(getAllConversationAndGroup());
      setLoading(false);
    })();
  }, []);

  console.log(post, "post in share dialog");
  console.log(users);
  console.log(sendingData, "sendingData");

  const returnSelectedOrNot = (conversationId, userId) => {
    let answer = selectedUsersId.some(
      (item) => item?.conversationId == conversationId && item?.userId == userId
    );
    if (answer) {
      return (
        <div className="w-4 h-4 flex items-center justify-center bg-blue-500 rounded-full absolute bottom-10 right-6">
          <Check strokeWidth={5} className="w-3 h-3" />
        </div>
      );
    }
  };

  const handleClickToSendMessage = async () => {
    try {
      setLoading(true);
      for (const item of selectedUsersId) {
        const data = {
          conversationId: item.conversationId,
          tempId: Date.now(),
          status: [
            {
              userId: item.userId,
              state: "sending",
              receivedAt: "",
              readAt: "",
            },
          ],
          reactions: [],
          ...sendingData,
        };

        dispatch(updateCurrentUserMessage(data));

        const result = await dispatch(createMessage(data));

        if (result?.payload?.conversationId) {
          console.log(result.payload, "result in message chat");
          dispatch(
            updatingStatusForMessages({
              newStatus: "sent",
              tempId: data.tempId,
              realMessageId: result.payload._id,
            })
          );
          dispatch(
            updateUpSideDownTheAllConversationsAndGroups(item.conversationId)
          );
        }
      }
      setLoading(false);
      onClose();
      setSelectedUsersId([]);
      toast.success("Message sent successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[50000] bg-black/70 flex justify-center items-end md:items-center">
      <div
        ref={dialogRef}
        className="bg-[#1a1a1a] w-full md:w-[500px] max-w-full border border-white/10 h-[70vh] md:h-[500px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
          <button
            onClick={onClose}
            className="text-white cursor-pointer text-lg font-bold hover:opacity-80"
          >
            ✕
          </button>
          <h2 className="text-white text-base font-semibold">Share</h2>
          <div className="w-6" /> {/* spacer */}
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#333] text-white rounded-md px-3 py-2 text-sm placeholder-white/50 outline-none"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 hide-scrollbar scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="grid grid-cols-4 gap-4">
            {loading && (
              <div className="col-span-4 w-full flex justify-center items-center text-center text-white/50 text-sm">
                <Loader />
              </div>
            )}
            {filteredUsers.length > 0 && !loading ? (
              filteredUsers.map((user, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleSelectUser(user.conversationId, user.userId)
                  }
                  className="flex relative flex-col items-center text-center cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border border-white/10"
                  />
                  <span className="mt-1 text-white text-xs truncate w-full">
                    {user.name}
                  </span>
                  {user.userName && (
                    <span className="text-xs text-gray-400">
                      {user.userName}
                    </span>
                  )}
                  {returnSelectedOrNot(user.conversationId, user.userId)}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-white/50 text-sm">
                No users found
              </div>
            )}
          </div>
        </div>

        {selectedUsersId.length > 0 && (
          <button
            onClick={handleClickToSendMessage}
            className="px-4 py-2 bg-blue-500 flex items-center justify-center cursor-pointer text-white rounded-b-2xl"
          >
            {loading ? <Loader /> : "Send"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareDialog;
