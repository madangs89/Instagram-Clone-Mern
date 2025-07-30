import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Redux/Services/UserThunk";
import FullPageLoader from "../components/Deloper/FullPageLoader";
const dummyHighlights = [
  { id: 1, label: "🪔", image: "/highlight1.jpg" },
  { id: 2, label: "💪", image: "/highlight2.jpg" },
  { id: 3, label: "💜", image: "/highlight3.jpg" },
  { id: 1, label: "🪔", image: "/highlight1.jpg" },
  { id: 2, label: "💪", image: "/highlight2.jpg" },
  { id: 3, label: "💜", image: "/highlight3.jpg" },
  { id: 1, label: "🪔", image: "/highlight1.jpg" },
  { id: 2, label: "💪", image: "/highlight2.jpg" },
  { id: 3, label: "💜", image: "/highlight3.jpg" },
  { id: 1, label: "🪔", image: "/highlight1.jpg" },
  { id: 2, label: "💪", image: "/highlight2.jpg" },
  { id: 3, label: "💜", image: "/highlight3.jpg" },
  { id: 1, label: "🪔", image: "/highlight1.jpg" },
  { id: 2, label: "💪", image: "/highlight2.jpg" },
  { id: 3, label: "💜", image: "/highlight3.jpg" },
];

const dummyPosts = [
  "/post1.jpg",
  "/post2.jpg",
  "/post3.jpg",
  "/post1.jpg",
  "/post2.jpg",
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      await dispatch(getUser());
    })();

    console.log(data);
  }, []);

  if (data.loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-black px-4 md:px-20 overflow-x-hidden text-white">
      {/* Profile Info */}
      <div className="w-full flex flex-col md:flex-row py-6 border-b border-neutral-800">
        <div className="w-full md:w-1/3 flex items-center justify-center mb-4 md:mb-0">
          <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <img
              src={data.avatar || "/default-avatar.jpg"}
              alt=""
              className="h-32 w-32 object-cover rounded-full border-4 border-black"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4 px-2">
          <div className="flex items-center gap-4 text-xl font-semibold">
            <p>{data.userName}</p>
            <Link to="/profile/edit/madan">
              <Button variant="black" className="bg-[#27272a]">
                Edit Profile
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 text-sm md:text-base">
            <p>
              <strong>0</strong> posts
            </p>
            <p>
              <strong>{data?.followers?.length}</strong> followers
            </p>
            <p>
              <strong>{data?.following?.length}</strong> following
            </p>
          </div>
          <div className="text-sm text-gray-300 leading-tight">
            <p><strong>{data.name}</strong></p>
            {data?.bio?.split("\n").map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
            {/* {data.bio || "No bio available."} */}
          </div>
          <div className="flex gap-4 text-sm text-white md:text-base">
            <p>{data.website}</p>
            <p>{data.gender}</p>
          </div>
        </div>
      </div>
      {/* Highlights */}
      <div className="flex min-h-[130px] space-x-4 py-4 overflow-x-auto overflow-y-hidden hide-scrollbar">
        {dummyHighlights.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <img
                src={item.image}
                alt=""
                className="h-16 w-16 object-cover rounded-full border-4 border-black"
              />
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-neutral-800 mt-6 flex justify-center gap-10">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-3 font-medium ${
            activeTab === "posts"
              ? "border-t-2 border-white text-white"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-3 font-medium ${
            activeTab === "saved"
              ? "border-t-2 border-white text-white"
              : "text-gray-500"
          }`}
        >
          Saved
        </button>
      </div>

      {/* Post Grid */}
      {activeTab === "posts" && (
        <div className="grid grid-cols-3 min-h-[500px] gap-1 mt-4">
          {dummyPosts.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="post"
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="flex justify-center min-h-[500px] items-center h-40 text-gray-500 text-sm mt-6">
          No saved posts yet.
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
