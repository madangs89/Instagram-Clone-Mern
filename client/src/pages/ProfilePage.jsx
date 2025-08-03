import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostForProfile,
  getReelForProfile,
  getUser,
} from "../Redux/Services/UserThunk";
import VideoPost from "../components/Deloper/VideoPost";

import Loader from "../components/Deloper/Loader";
import Story from "../components/Deloper/Story";
import FollowUnFolowButton from "../components/Deloper/FollowUnFolowButton";
import { Plus } from "lucide-react";
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
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();
  const params = useParams();
  const data = useSelector((state) => state.user);
  const storyData = useSelector((state) => state.mediaFeed);
  const userData = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await dispatch(getUser(params.id));
      await dispatch(getPostForProfile(params.id));
    })();
  }, []);

  const handler = async (tab) => {
    if (tab === "reels") {
      await dispatch(getReelForProfile(params.id));
    }
    setActiveTab(tab);
  };

  console.log(userData.getCurrentUser, "userData.getCurrentUser");
  if (data.loading) {
    return <FullPageLoader />;
  }
  return (
    <div className="flex-1 min-h-screen flex flex-col bg-black px-4 md:px-20 overflow-x-hidden text-white">
      {/* Profile Info */}
      <div className="w-full flex flex-col justify-center md:flex-row py-6 border-b border-neutral-800">
        
        {/* Profile Picture */}
        <div className="w-full md:w-1/3 flex items-center justify-center mb-4 md:mb-0">
          {auth._id == params.id ? (
            <Story
              key={userData._id}
              id={userData._id}
              username="Your Story"
              avatar={userData.avatar}
            />
          ) : (
            <div
              onClick={() => {
                if (auth._id == params.id) {
                  navigate("/create");
                }
              }}
              className="flex cursor-pointer flex-col items-center space-y-1"
            >
              <div className="w-[87px] relative h-[87px] rounded-full p-[3px]">
                <img
                  src={data?.getCurrentUser?.avatar || "/default-avatar.jpg"}
                  alt={"image"}
                  className="w-full  border-[4px] border-black h-full object-fit rounded-full"
                />
              </div>
              <p className="text-xs text-center text-white  w-16">
                {auth._id == params.id ? "You" : data?.getCurrentUser?.userName}
              </p>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col  justify-center gap-4 px-2">
          <div className="flex items-center gap-4 text-xl font-semibold">
            <p>{data?.getCurrentUser?.userName}</p>
            {auth._id == params.id && (
              <Link to={`/profile/edit/${auth._id}`}>
                <Button variant="black" className="bg-[#27272a]">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
          <div className="flex gap-4 text-sm md:text-base">
            <p>
              <strong>0</strong> posts
            </p>
            <p>
              <strong>{data?.getCurrentUser?.followers?.length}</strong>{" "}
              followers
            </p>
            <p>
              <strong>{data?.getCurrentUser?.following?.length}</strong>{" "}
              following
            </p>
          </div>
          <div className="text-sm text-gray-300 leading-tight">
            <p>
              <strong>{data?.getCurrentUser?.name}</strong>
            </p>
            {data?.getCurrentUser?.bio?.split("\n").map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
            {/* {data.bio || "No bio available."} */}
          </div>
          {auth._id != params.id &&
            data.following &&
            !data.following.includes(params.id) && (
              <div className="flex gap-4 text-sm text-white md:text-base">
                <FollowUnFolowButton id={params.id} />
                <Button variant="black" className="bg-[#27272a]">
                  Message
                </Button>
              </div>
            )}
          {auth._id != params.id &&
            data.following &&
            data.following.includes(params.id) && (
              <div className="flex gap-4 text-sm text-white md:text-base">
                <FollowUnFolowButton clr="text-blue-500" id={params.id} />
                <Button variant="black" className="bg-[#27272a]">
                  Message
                </Button>
              </div>
            )}
          <div className="flex gap-4 text-sm text-white md:text-base">
            <p>{data?.getCurrentUser?.website}</p>
            <p>{data?.getCurrentUser?.gender}</p>
          </div>
        </div>
      </div>
      {/* Highlights */}
      <div className="flex min-h-[130px] space-x-4 py-4 px-5 overflow-x-auto overflow-y-hidden hide-scrollbar">
        <div className="flex flex-col items-center">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <img
              src={dummyHighlights[0].image}
              alt=""
              className="h-16 w-16 object-cover rounded-full border-4 border-black"
            />
          </div>
          <span className="text-xs mt-1">{"Add"}</span>
        </div>
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
          onClick={() => handler("reels")}
          className={`py-3 font-medium ${
            activeTab === "reels"
              ? "border-t-2 border-white text-white"
              : "text-gray-500"
          }`}
        >
          Reels
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
        <div className="grid grid-cols-3 min-h-[600px] gap-1 mt-4">
          {data?.userPosts?.map((post, index) => {
            return post.mediaType == "image" ? (
              <div key={index} className="w-full aspect-[3/4] bg-neutral-900">
                <img
                  src={post?.media[0]?.url}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <VideoPost
                aspectRatio="aspect-[3/4]"
                key={index}
                src={post?.media[0]?.url}
                isActive={"false"}
              />
            );
          })}
        </div>
      )}

      {/* Reels */}
      {activeTab === "reels" && (
        <div className="grid grid-cols-3 min-h-[500px] gap-1 mt-4">
          {data.loading ? (
            <Loader />
          ) : data?.userReels?.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-10">
              No reels available.
            </div>
          ) : (
            data.userReels.map((post, index) => (
              <VideoPost key={index} src={post?.media} isActive={"false"} />
            ))
          )}
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
