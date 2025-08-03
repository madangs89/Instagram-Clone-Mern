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
import { useNavigate, useParams } from "react-router-dom";

const dummyMessages = [
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
  { fromSelf: true, text: "Hey", id: 1 },
  { fromSelf: false, text: "Hi!", id: 2 },
  { fromSelf: true, text: "What's up?", id: 3 },
];

const MessageChat = ({ setIsChatOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  console.log(file);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messageRef]);

  return (
    <div className="flex flex-col h-[100dvh] text-white w-full bg-black">
      {/* Header */}
      <div className="p-4 flex items-center  justify-between border-b font-semibold sticky top-0 bg-black z-10 border-[0.1px] border-[#2f2f2f] text-sm sm:text-base">
        <div className="flex gap-2 items-center justify-center">
          <img
            className="w-10 h-10 rounded-full  object-cover"
            src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
            alt=""
          />
          <div className="flex flex-col">
            <div className="font-medium">{"Navya"}</div>
            <div className="text-xs text-gray-500">
              {"asdfasdfasdf"} • {"12:10"}
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
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
      >
        {dummyMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm break-words ${
                msg.fromSelf
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
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
              <SendHorizontal className="w-5 h-5 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
