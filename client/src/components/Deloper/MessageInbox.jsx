import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";

const dummyConversations = [
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "UnLucky NR",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
  {
    id: "1",
    name: "Manu Naik",
    last: "sent an attachment",
    time: "6d",
    unread: true,
  },
  {
    id: "2",
    name: "Madan",
    last: "sent an attachment",
    time: "1w",
    unread: true,
  },
];
const MessageInbox = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full text-white overflow-hidden">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold mt-2 py-2">madan_g_s_naik</h2>
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
        {dummyConversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/message/${chat.id}`)}
            className="flex items-center justify-between px-4 py-3 cursor-pointer transition-[background] duration-200 ease-in hover:bg-[#262626]"
          >
            <div className="flex gap-2 items-center justify-center">
              <img
                className="w-10 h-10 rounded-full  object-cover"
                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                alt=""
              />
              <div className="flex flex-col">
                <div className="font-medium">{chat.name}</div>
                <div className="text-xs text-gray-500">
                  {chat.last} • {chat.time}
                </div>
              </div>
            </div>
            {chat.unread && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageInbox;
