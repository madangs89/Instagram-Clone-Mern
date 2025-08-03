import React, { useEffect, useRef } from "react";
import CommentShowingDiv from "./CommentShowingDiv";

const mockComments = [
  {
    username: "nithya_19sre",
    verified: true,
    comment: "ಜೆ ಅಂಜನೇಯ 💖💪",
    weeksAgo: "7 w",
    likes: 0,
    replies: [],
  },
  {
    username: "baby__doll___savitha__savi",
    comment: "ನಮ್ಮ ಕಂಜೆಗೇಳ್🥰🙏",
    weeksAgo: "7 w",
    likes: 310,
    replies: [
      {
        username: "baby__doll___savitha__savi",
        comment: "ನಮ್ಮ ಕಂಜೆಗೇಳ್🥰🙏",
        weeksAgo: "7 w",
        likes: 310,
        replies: [],
      },
      {
        username: "baby__doll___savitha__savi",
        comment: "ನಮ್ಮ ಕಂಜೆಗೇಳ್🥰🙏",
        weeksAgo: "7 w",
        likes: 310,
        replies: [],
      },
    ],
  },
  {
    username: "broken_heart_s_143_b_",
    comment: "😍😍",
    weeksAgo: "7 w",
    likes: 20,
    replies: [],
  },
  {
    username: "ashwinii_b",
    comment: "ಸ್ನೇಹಿತ್ ನಮ್ಮ ಊರಿಗೆ ಬಂದಿದ್ದಾರ್ 🙏",
    weeksAgo: "7 w",
    likes: 46,
    replies: [],
  },
];

const Dialoger = ({ onClose  }) => {
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
    <div
      ref={dialogRef}
      onClick={(e) => e.stopPropagation()}
      className="bg-black w-full max-w-md mx-auto rounded-t-3xl z-[50000] absolute bottom-0 h-[400px] text-white flex flex-col"
    >
      {/* Header */}
      <div className="text-center py-2 font-semibold border-b border-gray-700">
        Comments
      </div>

      {/* Scrollable Comments */}
      <div className="flex-1 overflow-y-auto hide-scrollbar   px-4 py-2 space-y-4">
        {mockComments.map((c, index) => (
          <CommentShowingDiv key={index} c={c} index={index} />
        ))}
      </div>

      {/* Input Footer */}
      <div className="border-t border-gray-700 px-4 py-2 bg-black">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent text-white outline-none placeholder-gray-400"
          />
          <button className="text-blue-500 font-medium">Post</button>
        </div>
      </div>
    </div>
  );
};

export default Dialoger;
