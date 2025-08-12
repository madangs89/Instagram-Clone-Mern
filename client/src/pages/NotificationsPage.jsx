import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserNotification,
  markTheNotificationAsRead,
} from "../Redux/Services/mediaFeedThunk";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    user: "John Doe",
    message: "liked your photo.",
    time: "2m",
    avatar: "https://i.pravatar.cc/150?img=1",
    read: false,
  },
  {
    id: 2,
    user: "Jane Smith",
    message: "started following you.",
    time: "10m",
    avatar: "https://i.pravatar.cc/150?img=2",
    read: false,
  },
  {
    id: 3,
    user: "Alex Carter",
    message: "commented: Nice shot!",
    time: "1h",
    avatar: "https://i.pravatar.cc/150?img=3",
    read: true,
  },
];

export default function NotificationsPage() {
  // const [notifications, setNotifications] = useState(initialNotifications);
  const notifications = useSelector((state) => state.mediaFeed.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const markAsRead = (id) => {
  //   setNotifications((prev) =>
  //     prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  //   );
  // };

  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(getAllUserNotification());
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const messageTypeFinder = (userName, type, data) => {
    switch (type) {
      case "like":
        return `${userName} liked your ${data == "post" ? "post" : "reel"}.`;
      case "comment":
        return `${userName} commented on your ${
          data == "post" ? "post" : "reel"
        }.`;
      case "follow":
        return `${userName} started following you.`;
      default:
        return "";
    }
  };

  const getIfWantToShowMedia = (n) => {
    if (n.for == "post" || n.for == "Post") {
      if (n.post) {
        if (n.post.media[0].url.includes("mp4")) {
          return (
            <video
              onClick={() => navigate(`/explore/post/${n.post._id}`)}
              className="w-5 h-5 object-cover cursor-pointer"
              src={n.post.media[0].url}
            ></video>
          );
        } else {
          return (
            <img
              onClick={() => navigate(`/explore/post/${n.post._id}`)}
              className="w-5 h-5 object-cover cursor-pointer"
              src={n.post.media[0].url}
            ></img>
          );
        }
      }
    } else if (n.for == "reel" || n.for == "Reel") {
      if (n.reel) {
        if (n.reel.media) {
          return (
            <video
              onClick={() => navigate(`/explore/reel/${n.reel._id}`)}
              className="w-5 h-5 object-cover cursor-pointer"
              src={n.reel.media}
            ></video>
          );
        }
      }
    }
  };
  const handleClick = async (id) => {
    try {
      const data = await dispatch(markTheNotificationAsRead(id));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex-1 bg-black text-white px-4 py-6 sm:px-10">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4 cursor-pointer">
        {notifications &&
          notifications.length > 0 &&
          notifications.map((n, index) => (
            <div
              key={index}
              onClick={() => handleClick(n._id)}
              className={`flex items-center gap-4 p-3 rounded-xl  transition-all duration-300
             bg-black hover:bg-[#262626] 
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={n.sender.avatar}
                  alt={n.sender.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {!n?.isRead && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-black"></span>
                )}
              </div>
              {/* Notification Text */}
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base ${
                    !n.read ? "font-semibold" : "font-normal text-gray-300"
                  }`}
                >
                  <span className="font-bold">{n?.sender.name}</span>{" "}
                  {messageTypeFinder("", n?.type, n?.for)}
                </p>
                <span className="text-xs text-gray-500">
                  •{" "}
                  {formatDistanceToNow(new Date(n?.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="">{getIfWantToShowMedia(n)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
