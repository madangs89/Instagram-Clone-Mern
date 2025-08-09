import React, { useState } from "react";

const SingleCommmentBox = ({ c, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    // Call API to add reply here
    console.log(`Replying to comment ${c._id}:`, replyText);
    setReplyText("");
    setReplying(false);
    setShowReplies(true);
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${isReply ? "ml-8" : ""}`}>
      {/* Comment details */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{c.username}</span>
        </div>
        <p className="text-sm">{c.comment}</p>
      </div>

      {/* Reply button */}
      {!isReply && (
        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 ml-1">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setReplying(!replying)}
          >
            Reply
          </span>
        </div>
      )}

      {/* Reply input */}
      {replying && (
        <div className="mt-1 flex gap-2 items-center">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="text-sm px-2 py-1 border rounded bg-transparent"
          />
          <button
            onClick={handleReplySubmit}
            className="text-xs text-blue-500 hover:underline"
          >
            Post
          </button>
        </div>
      )}

      {/* View replies toggle */}
      {!isReply && c.replies?.length > 0 && (
        <div
          onClick={() => setShowReplies(!showReplies)}
          className="ml-2 mt-1 text-sm text-gray-300 cursor-pointer"
        >
          {showReplies
            ? "Hide replies"
            : `View all ${c.replies.length} repl${
                c.replies.length > 1 ? "ies" : "y"
              }`}
        </div>
      )}

      {/* Render nested replies */}
      {showReplies &&
        c.replies?.map((reply) => (
          <SingleCommmentBox key={reply._id} c={reply} isReply={true} />
        ))}
    </div>
  );
};

export default SingleCommmentBox;
