import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import VideoPost from "./VideoPost";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  addAndRemoveFollower,
  addAndRemoveLike,
} from "../../Redux/Slice/UserSlice";
import { followUser, like, unFollowUser } from "../../Redux/Services/UserThunk";
import { toast } from "sonner";

import {useNavigate} from "react-router-dom"

export default function PostCard({ post, isActive }) {
  const [comment, setComment] = useState("");
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFollowAndUnFollow = async (id) => {
    dispatch(addAndRemoveFollower(id));
    console.log("clicking", data?.following?.includes(id));
    if (data?.following?.includes(id)) {
      try {
        const result = await dispatch(unFollowUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to unfollow the user`);
        }
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    } else {
      try {
        const result = await dispatch(followUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to follow the user`);
        }
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    }
  };

  const handlelikes = async (postId) => {
    dispatch(addAndRemoveLike(postId));
    try {
      const likeData = await dispatch(
        like({
          targetId: postId,
          targetType: "Post",
        })
      );
      console.log(likeData.payload);
      if (!likeData?.payload?.success) {
        dispatch(addAndRemoveLike(postId));
      }
    } catch (error) {
      console.log(error);
      dispatch(addAndRemoveLike(postId));
    }
  };

  return (
    <div className="bg-black md:border border-neutral-800 rounded-md w-full max-w-md mx-auto mb-1 md:mb-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div onClick={ () => navigate(`/profile/${post?.userId?._id}`) } className="flex items-center cursor-pointer space-x-3">
          <img
            src={post?.userId?.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-sm font-semibold">{post?.userId?.userName}</div>
          <span className="text-xs text-neutral-400">
            •{" "}
            {formatDistanceToNow(new Date(post?.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <button
          onClick={() => handleFollowAndUnFollow(post?.userId?._id)}
          className="text-xs font-[600] cursor-pointer border border-neutral-600 rounded-md px-3 py-1 flex items-center justify-center text-white"
        >
          {data?.following?.includes(post?.userId?._id) ? "Followed" : "Follow"}
        </button>
      </div>

      {/* Image */}
      <div onDoubleClick={() => handlelikes(post?._id)} className="">
        {post.mediaType == "image" ? (
          <div className="w-full  aspect-square bg-neutral-900">
            <img
              src={post?.media[0]?.url}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <VideoPost src={post?.media[0]?.url} isActive={isActive} />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between px-4 py-3">
        <div className="flex space-x-4">
          <div
            onClick={() => handlelikes(post?._id)}
            className={`cursor-pointer transition-transform duration-200 active:scale-125`}
          >
            {data?.userLikes.includes(post._id) ? (
              <Heart className="w-7 h-7 text-red-500 fill-red-500 transition-all duration-200" />
            ) : (
              <Heart className="w-7 h-7 text-white transition-all duration-200" />
            )}
          </div>
          <MessageCircle className="w-7 h-7" />
          <Send className="w-7 h-7" />
        </div>
        <Bookmark className="w-7 h-7" />
      </div>

      {/* Caption */}
      <div className="px-4 pb-2 text-sm">
        <span className="font-semibold">{post?.userId?.userName}</span>{" "}
        <span>{post?.caption}</span>
        {/* <div className="text-neutral-400 mt-1">{post.hashtags}</div> */}
      </div>

      {/* Comments */}
      {/* <div className="px-4 pb-1 text-sm text-neutral-400">
        View all {post.commentsCount} comment
        {post.commentsCount !== 1 ? "s" : ""}
      </div> */}

      <div className="flex items-center pr-5 justify-between">
        <Input
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          variant="unstyled"
          className="px-4 pb-3 text-sm text-neutral-400 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:outline-none shadow-none"
        />
        {comment ? (
          <button className="text-sm font-semibold text-white">Post</button>
        ) : null}
      </div>
    </div>
  );
}
