import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import FollowUnFolowButton from "./FollowUnFolowButton";
const VisibleModle = ({ onClose }) => {
  const d = useSelector((state) => state.mediaFeed);
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
      <div className="text-center py-2 font-semibold border-b border-gray-700">
        {d?.curretStoryView.length} view{" "}
        {d?.curretStoryView.length > 10 ? "s" : ""}
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar  px-4 py-2 space-y-4">
        {d?.curretStoryView.map((user, index) => (
          <div className="flex justify-between items-center gap-3" key={index}>
            <div className=" flex items-center justify-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{user.userName}</p>
                <p className="text-xs text-neutral-500"> </p>
              </div>
            </div>
            <FollowUnFolowButton id={user.userId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisibleModle;
