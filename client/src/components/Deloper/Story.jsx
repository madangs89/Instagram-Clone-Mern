import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
export default function Story({ avatar, username, id, media }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [trueOrFalse, setTrueOrFalse] = useState(false);
  const isFullSawOrWhat = (media) => {
    return media.every((item) => item.seen);
  };

  useEffect(() => {
    if (media?.length && media.length > 0 && userData?._id != id) {
      const data = isFullSawOrWhat(media);
      setTrueOrFalse(data);
    }
  }, [media]);

  const handleOnClick = () => {
    navigate(`/story/${id}`);
  };
  return (
    <div
      onClick={handleOnClick}
      className="flex cursor-pointer flex-col items-center space-y-1"
    >
      <div
        className={`w-[87px] h-[87px] rounded-full p-[3px] ${
          trueOrFalse ? "bg-gray-500 " : "bg-gradient-to-tr"
        }   from-yellow-400 via-pink-500 to-purple-600`}
      >
        <img
          src={avatar}
          alt={username}
          className="w-full  border-[4px] border-black h-full object-fit rounded-full"
        />
      </div>
      <p className="text-xs text-center text-white truncate w-16">{username}</p>
    </div>
  );
}
