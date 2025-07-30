import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

export default function PostCard({ post }) {
  const [comment, setComment] = useState("");
  return (
    <div className="bg-black md:border border-neutral-800 rounded-md w-full max-w-md mx-auto mb-1 md:mb-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.userAvatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-sm font-semibold">{post.username}</div>
          <span className="text-xs text-neutral-400">• {post.time}</span>
        </div>
        <button className="text-xl font-bold text-white">⋯</button>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-neutral-900">
        <img
          src={post.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between px-4 py-3">
        <div className="flex space-x-4">
          <Heart className="w-7 h-7" />
          <MessageCircle className="w-7 h-7" />
          <Send className="w-7 h-7" />
        </div>
        <Bookmark className="w-7 h-7" />
      </div>

      {/* Caption */}
      <div className="px-4 pb-2 text-sm">
        <span className="font-semibold">{post.username}</span>{" "}
        <span>{post.caption}</span>
        <div className="text-neutral-400 mt-1">{post.hashtags}</div>
      </div>

      {/* Comments */}
      <div className="px-4 pb-1 text-sm text-neutral-400">
        View all {post.commentsCount} comment
        {post.commentsCount !== 1 ? "s" : ""}
      </div>

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
