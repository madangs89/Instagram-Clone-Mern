import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";

import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { addConversation } from "../../Redux/Services/MessageThunk";
import {
  rechangeInbox,
  setSelectedIndex,
} from "../../Redux/Slice/MessageSlice";
import { formatDistanceToNow } from "date-fns";
const MessageInbox = ({ allInbox }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isUnReadMessage = (chat) => {
    if (!chat?.unreadCount || !Array.isArray(chat.unreadCount)) return false;

    return chat.unreadCount.some(
      (unread) =>
        unread?.userId === (user?._id || data?._id) && unread?.count > 0
    );
  };
  if (allInbox.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const onClickHandler = async (chat, index) => {
    if (chat.conversationId) {
      dispatch(setSelectedIndex(allInbox[index]));
      navigate(`/message/${chat.conversationId}`);
    } else {
      try {
        const data = await dispatch(addConversation({ members: [chat._id] }));
        console.log(data.payload._id, "data in message inbox");
        dispatch(
          rechangeInbox({ userId: chat._id, conversationId: data.payload._id })
        );
        dispatch(setSelectedIndex(allInbox[index]));
        navigate(`/message/${data.payload._id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="h-full text-white overflow-hidden">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold mt-2 py-2">{data.userName}</h2>
          <ArrowLeft
            onClick={() => {
              navigate(`/`);
            }}
            className="w-6 h-6 md:hidden cursor-pointer"
          />
        </div>
        <Input className="w-full mx-auto" />
      </div>
      <h2 className="text-md font-bold px-4 mt-3">Messages</h2>
      <div className=" mb-8  h-[80vh] custom-scrollbar2 overflow-y-scroll">
        {allInbox.map((chat, index) => (
          <div
            key={index}
            onClick={() => onClickHandler(chat, index)}
            className="flex items-center justify-between px-4 py-3 cursor-pointer transition-[background] duration-200 ease-in hover:bg-[#262626]"
          >
            <div className="flex gap-2 items-center justify-center">
              <img
                className="w-10 h-10 rounded-full  object-cover"
                src={chat?.isGroup ? chat?.groupAvatar : chat?.avatar}
                alt=""
              />
              <div className="flex flex-col">
                <div className="font-medium">
                  {chat?.isGroup ? chat?.groupName : chat?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {chat?.isGroup ? chat?.lastMessage : chat?.lastMessage} •{" "}
                  {formatDistanceToNow(new Date(chat?.lastMessageTime), {
                    addSuffix: false,
                  })}
                </div>
              </div>
            </div>
            {isUnReadMessage(chat) && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageInbox;
