import React, { useEffect, useRef } from "react";
import CommentShowingDiv from "./CommentShowingDiv";

const Dialoger = ({
  onClose,
  comments,
  setComments,
  comment,
  setComment,
  addComments,
  reelId,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[50000] bg-black/70 flex justify-center items-end md:items-center">
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-black w-full md:w-[500px] max-w-full border h-[70vh] md:h-[500px] flex flex-col"
      >
        {/* Header */}
        <div className="text-center py-3 my-3 font-semibold border-b border-white/10 text-white">
          Comments
        </div>
        {/* Scrollable Comments */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {comments && comments.length > 0 ? (
            comments.map((c, index) => (
              <CommentShowingDiv
                key={index}
                c={c}
                index={index}
                setComments={setComments}
                noReply
              />
            ))
          ) : (
            <div className="text-white text-center">No comments yet</div>
          )}
        </div>
        {/* Input Footer */}
        <div className="border-t border-white/10 px-4 py-2 bg-black">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-white outline-none placeholder-white/50 text-sm"
            />
            {comment && (
              <button
                onClick={() => addComments(reelId ? reelId : "")}
                className="text-[#0095f6] cursor-pointer font-semibold text-sm hover:opacity-80 transition"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialoger;
