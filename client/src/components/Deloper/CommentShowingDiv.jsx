import React, { useState } from "react";
import SingleCommmentBox from "./SingleCommmentBox";

const CommentShowingDiv = ({ c, index }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div key={index}>
      {/* Top-level comment with toggle */}
      <SingleCommmentBox
        setShowReplies={setShowReplies}
        showReplies={showReplies}
          isReply={false}
        c={c}
      />

      {/* Nested replies – no toggle passed */}
      {showReplies &&
        c.replies.map((reply, index) => (
          <div key={index} className="ml-10">
            <SingleCommmentBox c={reply} isReply={true} />
          </div>
        ))}
    </div>
  );
};

export default CommentShowingDiv;
