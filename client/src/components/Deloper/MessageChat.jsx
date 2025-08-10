import {
  ArrowBigLeft,
  ArrowBigLeftDashIcon,
  ArrowLeft,
  CheckCheck,
  Clock3,
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
  addReactions,
  createMessage,
  getAllMessageReaction,
  getCurrentUserMessage,
  removeMessageReaction,
  uploadMediatoClodinary,
} from "../../Redux/Services/MessageThunk";
import Loader from "./Loader";
import {
  clearSelectedCurrentUserMessage,
  updateCurrentUserMessage,
  updateMessageReactionEmoji,
  updateUpSideDownTheAllConversationsAndGroups,
  updatingStatusForMessages,
} from "../../Redux/Slice/MessageSlice";
import { Check } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
const MessageChat = ({ setIsChatOpen }) => {
  const messageSlice = useSelector((state) => state.message);
  const user = useSelector((state) => state.user);
  const selectedIndex = messageSlice.selectedIndex;
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const messageRef = useRef(null);
  const [hoverShow, setHoverShow] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const timerRef = useRef(null);
  const [selectedEmoji, setSelectedEmoji] = useState({
    messageId: null,
    emoji: null,
    userId: null,
  });
  const isFetchingOlderMessagesRef = useRef(false);
  const [mobileEmoji, setMobileEmoji] = useState(false);
  const [mobileViewData, setMobileViewData] = useState(null);
  const emojiRef = useRef(null);
  const reactionRef = useRef(null);
  const keyboardEmojiRef = useRef(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [currentlySelectedMessageId, setCurrentlySelectedMessageId] =
    useState(null);
  const dispatch = useDispatch();

  const [keyboardEmojiShow, setKeyboardEmojiShow] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef, showEmoji]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showReactionsModal &&
        reactionRef.current &&
        !reactionRef.current.contains(event.target)
      ) {
        setShowReactionsModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionsModal, reactionRef]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        keyboardEmojiShow &&
        keyboardEmojiRef.current &&
        !keyboardEmojiRef.current.contains(event.target)
      ) {
        setKeyboardEmojiShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [keyboardEmojiShow, keyboardEmojiRef]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 0); // wait for DOM paint
    return () => clearTimeout(timeout);
  }, [messageSlice.loading2, id]);

  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    const currentMessageCount = messageSlice.currentUserMessage.length;
    if (isFetchingOlderMessagesRef.current) {
      isFetchingOlderMessagesRef.current = false;
      return; // skip scroll-to-bottom on pagination
    }
    if (currentMessageCount > prevMessageCountRef.current) {
      // Only scroll when new message added
      if (messageRef.current) {
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      }
    }
    prevMessageCountRef.current = currentMessageCount;
  }, [messageSlice.currentUserMessage]);
  useEffect(() => {
    setPage(1);
    dispatch(clearSelectedCurrentUserMessage());
    (async () => {
      const data = {
        id: id,
      };
      await dispatch(getCurrentUserMessage(data));
    })();
  }, [id]);

  const checkTheStatus = (status) => {
    let sent = 0,
      sennding = 0,
      delivered = 0,
      seen = 0;
    status.forEach((item) => {
      if (item.state === "sent") sent++;
      if (item.state === "sending") sennding++;
      if (item.state === "delivered") delivered++;
      if (item.state === "seen") seen++;
    });
    if (sennding) {
      return <Clock3 className="text-gray-500 w-4 h-4 flex-shrink-0" />;
    } else if (sennding == 0 && sent > delivered && sent > seen) {
      return <Check className="text-gray-500 w-4 h-4 flex-shrink-0" />;
    } else if (sennding == 0 && delivered > sent && delivered > seen) {
      return <CheckCheck className="text-gray-500 w-4 h-4 flex-shrink-0" />;
    } else if (sennding == 0 && seen > sent && seen > delivered) {
      return <CheckCheck className="text-green-500 w-4 h-4 flex-shrink-0" />;
    }
  };

  const handleSubmitMessage = async () => {
    try {
      if (!input && !file) return;
      let media = [];
      if (isFileSelected && file) {
        media.push({
          url: URL.createObjectURL(file),
          publicId: Date.now(),
          type: file.type.includes("image") ? ["image"] : ["video"],
        });
      }
      const data = {
        conversationId: id,
        text: input,
        tempId: Date.now(),
        status: [
          {
            userId: !selectedIndex.isGroup && selectedIndex?.userId,
            state: "sending",
            receivedAt: "",
            readAt: "",
          },
        ],
        reactions: [],
      };
      if (file && isFileSelected) {
        let newMedia = [];
        const tempData = { ...data, media, sender: user._id };
        dispatch(updateCurrentUserMessage(tempData));
        setIsFileSelected(false);
        setInput("");
        const formData = new FormData();
        formData.append("media", file);
        const result = await dispatch(uploadMediatoClodinary(formData));
        if (result?.payload?.success) {
          const finalData = result.payload.data;
          newMedia.push({
            url: finalData.url,
            publicId: finalData.publicId,
            type: finalData.type,
          });
          const originalData = {
            ...data,
            media: newMedia,
          };
          const answer = await dispatch(createMessage(originalData));
          if (answer?.payload?.conversationId) {
            dispatch(
              updatingStatusForMessages({
                newStatus: "sent",
                tempId: data.tempId,
                realMessageId: answer.payload._id,
              })
            );
            setInput("");
            dispatch(updateUpSideDownTheAllConversationsAndGroups(id));
          }
          setFile(null);
        }
      } else {
        const tempData = { ...data, media, sender: user._id };
        dispatch(updateCurrentUserMessage(tempData));
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
          setInput("");
          dispatch(updateUpSideDownTheAllConversationsAndGroups(id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnEmojiClick = (emojiObject) => {
    console.log(emojiObject, "emojiObject");
    setSelectedEmoji((prev) => ({ ...prev, emoji: emojiObject.emoji }));
    dispatch(
      updateMessageReactionEmoji({
        emoji: emojiObject.emoji,
        messageId: selectedEmoji.messageId,
        userId: selectedEmoji.userId,
      })
    );
    setShowEmoji(false);
    setMobileEmoji(false);

    try {
      const data = dispatch(
        addReactions({
          emoji: emojiObject.emoji,
          messageId: selectedEmoji.messageId,
        })
      );
      console.log(data, "data adding the reactions");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenEmoji = (id) => {
    setShowEmoji(true);
    setSelectedEmoji({
      emoji: null,
      messageId: id,
      userId: user._id,
    });
  };

  const handleTouchStart = (data) => {
    timerRef.current = setTimeout(() => {
      console.log("📱 Long press detected on mobile");
      setMobileViewData(data);
      setSelectedEmoji({ emoji: null, messageId: data.id, userId: user._id });
      setMobileEmoji(true);
    }, 800); // press time in ms
  };

  const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
    setMobileViewData(null);
    setMobileEmoji(false);
  };

  const handleMessageShowReactions = async (id) => {
    setCurrentlySelectedMessageId(id);
    try {
      const data = await dispatch(getAllMessageReaction({ messageId: id }));
      if (data.payload.success) {
        setShowReactionsModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveReaction = async (userId) => {
    if (user._id !== userId) return;
    try {
      if (user._id == userId) {
        await dispatch(
          removeMessageReaction({
            messageId: currentlySelectedMessageId,
            user: userId,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && (input || file)) {
        e.preventDefault(); // stop default form submit
        handleSubmitMessage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [input, file]); // no need for isFileSelected here

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
        <div
          onClick={() =>
            selectedIndex.isGroup == false &&
            navigate(`/profile/${selectedIndex?.userId}`)
          }
          className="flex gap-2 cursor-pointer items-center justify-center"
        >
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
        className="flex-1 relative overflow-x-hidden  overflow-y-auto px-3 py-2  space-y-5"
      >
        {showReactionsModal &&
          messageSlice?.currentMesageAllReactions.length > 0 && (
            <div
              ref={reactionRef}
              className="
    fixed z-10 
    bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 
    left-1/2 -translate-x-1/2
    rounded-t-3xl md:rounded-2xl 
    w-[97%] md:w-[400px] 
    min-h-[350px] md:min-h-[200px] 
    bg-neutral-900 text-white shadow-lg
  "
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-700">
                <button
                  onClick={() => setShowReactionsModal(false)}
                  className="text-xl cursor-pointer font-bold hidden md:block"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold">Reactions</h2>
                <div className="w-6"></div> {/* Spacer for alignment */}
              </div>
              {/* Reaction list */}
              <div className="overflow-y-auto max-h-[250px]">
                {messageSlice?.currentMesageAllReactions &&
                  messageSlice?.currentMesageAllReactions.length > 0 &&
                  messageSlice?.currentMesageAllReactions.map((data, index) => {
                    return (
                      <div
                        onClick={() => handleRemoveReaction(data?.userId)}
                        key={index}
                        className={`flex justify-between items-center px-4 py-2 hover:bg-neutral-800 transition ${
                          data.userId == user._id ? "cursor-pointer" : ""
                        }`}
                      >
                        {/* Left: avatar + name */}
                        <div className="flex items-center gap-3">
                          <img
                            src={data?.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex gap-1 flex-col">
                            <span className="text-sm">{data?.name}</span>
                            <span className="text-[10px] text-gray-400">
                              {data?.userId == user._id
                                ? "Select To Remove"
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* Right: emoji */}
                        <span className="text-lg">{data?.emoji}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        {showEmoji && (
          <div
            ref={emojiRef}
            className="fixed overflow-hidden right-0 h-[400px] z-50"
          >
            <EmojiPicker
              onEmojiClick={handleOnEmojiClick}
              theme="dark"
              width="50"
              searchDisabled={true} // hides search bar
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
        {messageSlice.currentUserMessage &&
        messageSlice.currentUserMessage.length > 0 ? (
          messageSlice.currentUserMessage.map((msg, index) => {
            return (
              <div
                key={index}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handleTouchStart({
                    id: msg._id ? msg._id : msg?.tempId,
                    x: rect.left,
                    y: rect.top,
                  });
                }}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => {
                  console.log(msg, "msg mouse enter");
                  setHoverShow({
                    id: msg._id ? msg._id : msg?.tempId,
                    right: msg?.sender == user?._id ? true : false,
                  });
                }}
                onMouseLeave={() => setHoverShow({})}
                className={`flex flex-col relative ${
                  msg?.sender == user?._id ? "items-end" : "items-start"
                }`}
              >
                {mobileEmoji && (
                  <div className="md:hidden absolute bottom-0">
                    <EmojiPicker
                      onEmojiClick={handleOnEmojiClick}
                      theme="dark"
                      width="50"
                      searchDisabled={true} // hides search bar
                      skinTonesDisabled={true}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
                {msg.media &&
                  msg.media.length > 0 &&
                  msg.media.map((media, index) => {
                    return (
                      <div className="flex relative items-center justify-center gap-5">
                        {!msg.text &&
                          msg?.sender == user?._id &&
                          hoverShow?.id == (msg?.tempId || msg?._id) && (
                            <div
                              className={`md:flex hidden  text-white h-fit overflow-hidden gap-2`}
                            >
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                <Smile
                                  className="cursor-pointer rounded-full"
                                  onClick={() =>
                                    handleOpenEmoji(
                                      msg._id ? msg._id : msg.tempId
                                    )
                                  }
                                  size={16}
                                />
                              </button>
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                <ArrowBigLeft size={16} />
                              </button>
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                •••
                              </button>
                            </div>
                          )}
                        {/*  here showing if image there in message */}
                        <div
                          className="block p-1 overflow-hidden relative"
                          key={index}
                        >
                          {media.type.includes("image") ? (
                            <img
                              src={media.url}
                              alt=""
                              className="max-w-64 max-h-64 rounded-md aspect-auto object-cover"
                            />
                          ) : (
                            <video
                              src={media.url}
                              controls
                              className="max-w-64 max-h-64 rounded-md object-cover"
                            />
                          )}
                          {!msg.text &&
                            msg.reactions &&
                            msg.reactions.length != 0 && (
                              <div
                                onClick={() =>
                                  handleMessageShowReactions(msg._id)
                                }
                                className="absolute bottom-[1px] cursor-pointer bg-gray-500 text-[10px] rounded-full px-2 py-0.5 right-0"
                              >
                                {msg.reactions.map((item) => item.emoji)}
                              </div>
                            )}
                        </div>

                        {!msg.text &&
                          msg?.sender != user?._id &&
                          hoverShow?.id == (msg?.tempId || msg?._id) && (
                            <div
                              className={`md:flex hidden h-fit overflow-hidden text-white gap-2`}
                            >
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                <Smile
                                  className="cursor-pointer rounded-full"
                                  onClick={() =>
                                    handleOpenEmoji(
                                      msg._id ? msg._id : msg.tempId
                                    )
                                  }
                                  size={16}
                                />
                              </button>
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                <ArrowBigLeft size={16} />
                              </button>
                              <button className="p-1 hover:bg-gray-700 rounded-full">
                                •••
                              </button>
                            </div>
                          )}
                      </div>
                    );
                  })}
                {msg.text && (
                  <div className="max-w-[100%] items-center flex gap-3 ">
                    {msg?.sender == user?._id &&
                      hoverShow?.id == (msg?._id || msg?.tempId) && (
                        <div className={`md:flex hidden text-white gap-2 `}>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            <Smile
                              className="cursor-pointer rounded-full"
                              onClick={() => handleOpenEmoji(msg._id)}
                              size={16}
                            />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            <ArrowBigLeft size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            •••
                          </button>
                        </div>
                      )}
                    <div
                      className={`md:max-w-96 max-w-64 relative flex items-end justify-center gap-2 px-4 py-2 rounded-lg text-sm break-words ${
                        msg?.sender != user._id
                          ? "bg-blue-500 text-white"
                          : "bg-[#262626] text-white"
                      }`}
                    >
                      {msg.text}
                      {checkTheStatus(msg.status)}
                      {msg.reactions && msg.reactions.length != 0 && (
                        <div
                          onClick={() => handleMessageShowReactions(msg._id)}
                          className="absolute -bottom-2 cursor-pointer bg-gray-500 text-[10px] rounded-full px-2 py-0.5 right-0"
                        >
                          {msg.reactions.map((item) => item.emoji)}
                        </div>
                      )}
                    </div>
                    {msg?.sender != user?._id &&
                      hoverShow?.id == (msg?.tempId || msg?._id) && (
                        <div className={`hidden md:flex text-white gap-2 `}>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            <Smile
                              className="cursor-pointer rounded-full"
                              onClick={() =>
                                handleOpenEmoji(msg._id ? msg._id : msg.tempId)
                              }
                              size={16}
                            />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            <ArrowBigLeft size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded-full">
                            •••
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div>No messages yet</div>
        )}
      </div>
      {/* Showing Emoji For KeyBoard */}
      {keyboardEmojiShow && (
        <div
          ref={keyboardEmojiRef}
          className=" absolute bottom-0 left-auto md:left-1/2"
        >
          <EmojiPicker
            onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
            theme="dark"
            width="50"
            searchDisabled={true} // hides search bar
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
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
            <Smile
              onClick={() => setKeyboardEmojiShow(true)}
              className="cursor-pointer rounded-full"
            />
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
