import {
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  User,
  Video,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileNav = () => {
  const iconMap = {
    home: Home,
    search: Search,
    video: Video,
    "message-circle": MessageCircle,
    user: User,
  };
  const userData = useSelector((state) => state.user);
  const location = useLocation();
  const meessage = useSelector((state) => state.message);

  const isToShowNav = location.pathname.includes("message");

  if (isToShowNav) {
    return;
  }

  const instagramLinks = [
    {
      name: "Home",
      href: "/",
      icon: "home",
    },
    {
      name: "Search",
      href: "/explore",
      icon: "search",
    },
    {
      name: "Reels",
      href: "/reels",
      icon: "video",
    },
    {
      name: "Messages",
      href: "/message",
      icon: "message-circle",
    },
    {
      name: "Profile",
      href: "/profile/" + userData._id,
      icon: "user",
    },
  ];
  return (
    <>
      <div className="flex lg:hidden fixed bottom-0 justify-between items-center bg-black text-white p-3 px-10 w-full z-50">
        {instagramLinks.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <div
              key={link.name}
              className="flex relative cursor-pointer flex-col items-center"
            >
              <Link to={link.href}>
                <Icon className="h-7 w-7" />
              </Link>
              {link.href == "/message" && meessage.unreadMessageCount > 0 && (
                <div className="absolute text-white top-2 left-4 w-4 h-4 flex items-center text-[12px] justify-center  bg-red-500 rounded-full">
                  {meessage.unreadMessageCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MobileNav;
