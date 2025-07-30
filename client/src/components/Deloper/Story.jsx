import React from "react";

export default function Story({ avatar, username }) {
  return (
    <div className="flex cursor-pointer flex-col items-center space-y-1">
      <div className="w-[87px] h-[87px] rounded-full p-[3px]  bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
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
