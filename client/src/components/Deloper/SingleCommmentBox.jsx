import React from "react";

const SingleCommmentBox = ({ c, showReplies, setShowReplies, isReply }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{c.username}</span>
        </div>
        <p className="text-sm">{c.comment}</p>
      </div>

      {/* Show Reply only for top-level comments */}
      {!isReply && (
        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 ml-1">
          <span className="cursor-pointer">Reply</span>
        </div>
      )}

      {/* Show "View replies" only for top-level, not already opened */}
      {!isReply && c.replies.length > 0 && !showReplies && (
        <div
          onClick={() => setShowReplies && setShowReplies(!showReplies)}
          className="ml-2 mt-1 text-sm text-gray-300 cursor-pointer"
        >
          View all {c.replies.length} repl
          {c.replies.length > 1 ? "ies" : "y"}
        </div>
      )}
    </div>
  );
};

export default SingleCommmentBox;
