import {
  ArrowBigLeft,
  ArrowBigLeftDashIcon,
  ArrowLeft,
  Cross,
  Image,
  Send,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMessage,
  getCurrentUserMessage,
} from "../../Redux/Services/MessageThunk";
import Loader from "./Loader";

const MessageChat = ({ setIsChatOpen }) => {
  const messageSlice = useSelector((state) => state.message);
  const user = useSelector((state) => state.user);
  console.log(user, "user in message chat");
  const selectedIndex = messageSlice.selectedIndex;
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const messageRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messageRef]);

  useEffect(() => {
    (async () => {
      const data = await dispatch(getCurrentUserMessage(id));
      console.log(data, "data in message chat");
    })();
  }, [id]);

  const handleSubmitMessage = async () => {
    try {
      const data = {
        conversationId: id,
        text: input,
        status: [
          {
            userId: !selectedIndex.isGroup && selectedIndex?.userId,
          },
        ],
      };
      const result = await dispatch(createMessage(data));
      if (result?.payload?.conversationId) {
        setInput("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (messageSlice.loading2) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] text-white w-full bg-black">
      {/* Header */}
      <div className="p-4 flex items-center  justify-between border-b font-semibold sticky top-0 bg-black z-10 border-[0.1px] border-[#2f2f2f] text-sm sm:text-base">
        <div className="flex gap-2 items-center justify-center">
          <img
            className="w-10 h-10 rounded-full  object-cover"
            src={
              selectedIndex.isGroup
                ? selectedIndex?.groupAvatar
                : selectedIndex?.avatar
            }
            alt=""
          />
          <div className="flex flex-col">
            <div className="font-medium">
              {selectedIndex.isGroup
                ? selectedIndex?.groupName
                : selectedIndex?.userName}
            </div>
            <div className="text-xs text-gray-500">
              {selectedIndex.isGroup
                ? selectedIndex?.groupName
                : selectedIndex?.name}{" "}
              • {selectedIndex.isGroup ? "Group" : "User"}
            </div>
          </div>
        </div>
        <ArrowLeft
          onClick={() => {
            navigate(`/message`);
            setIsChatOpen(false);
          }}
          className="w-6 h-6 cursor-pointer"
        />
      </div>
      {/* Messages list */}
      <div
        ref={messageRef}
        className="flex-1 overflow-y-auto px-3 py-2  space-y-2"
      >
        {messageSlice.currentUserMessage &&
        messageSlice.currentUserMessage.length > 0 ? (
          messageSlice.currentUserMessage.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg?.sender == user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm break-words ${
                  msg?.sender != user._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div>No messages yet</div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[0.1px] border-[#2f2f2f] sticky bottom-0 bg-black z-10">
        <div
          className={`flex w-full flex-col  border ${
            isFileSelected && file ? "rounded-md" : "rounded-full"
          } gap-2 px-2 py-2 text-sm`}
        >
          {isFileSelected && file && (
            <div className="flex  gap-2 items-center">
              {file.type.includes("image") ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-24 rounded-md h-24 "
                  />
                  <X
                    strokeWidth={3}
                    onClick={() => {
                      setFile(null);
                      setIsFileSelected(false);
                    }}
                    className="absolute cursor-pointer -top-1 bg-black rounded-full -right-1 w-5 p-1 h-5"
                  />
                </div>
              ) : (
                <div className="relative">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-24 rounded-md h-24 "
                  />
                  <X
                    strokeWidth={3}
                    onClick={() => {
                      setFile(null);
                      setIsFileSelected(false);
                    }}
                    className="absolute cursor-pointer -top-1 bg-black rounded-full -right-1 w-5 p-1 h-5"
                  />
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2 w-full">
            <Smile />
            <Image
              className="cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setIsFileSelected(true);
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              ref={inputRef}
              placeholder="Type a message..."
              className=" flex-1 focus:outline-none"
            />
            {(input || (isFileSelected && file)) && (
              <SendHorizontal
                onClick={handleSubmitMessage}
                className="w-5 h-5 cursor-pointer text-blue-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
