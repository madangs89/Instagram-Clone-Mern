import React from "react";
import { dummyPosts } from "../../utils/utilitity";
import PostCard from "./PostCard";

const PostWrapper = () => {
  return (
    <div className="flex mt-4 flex-col relative w-full md:max-w-2xl overflow-hidden ">
      {dummyPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostWrapper;
