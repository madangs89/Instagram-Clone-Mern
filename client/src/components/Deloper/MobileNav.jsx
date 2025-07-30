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
import { Link } from "react-router-dom";

const MobileNav = () => {
  const iconMap = {
    home: Home,
    search: Search,
    video: Video,
    "message-circle": MessageCircle,
    user: User,
  };

  const instagramLinks = [
    {
      name: "Home",
      href: "/",
      icon: "home",
    },
    {
      name: "Search",
      href: "/search",
      icon: "search",
    },
    {
      name: "Reels",
      href: "/reels",
      icon: "video",
    },
    {
      name: "Messages",
      href: "/messages",
      icon: "message-circle",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "user",
    },
  ];
  return (
    <>
      <div className="flex lg:hidden fixed bottom-0 justify-between items-center bg-black text-white p-4 px-10 w-full z-50">
        {/* {Object.entries(iconMap).map(([key, Icon]) => (
          <div key={key} className="flex flex-col items-center">
            <Icon className="h-7 w-7" />
          </div>
        ))} */}
        {
            instagramLinks.map((link) => {
              const Icon = iconMap[link.icon];
              return (
                <div key={link.name} className="flex cursor-pointer flex-col items-center">
                  <Link to={link.href}>
                    <Icon className="h-7 w-7" />
                  </Link>
                </div>
              );
            })
        }
      </div>
    </>
  );
};

export default MobileNav;
