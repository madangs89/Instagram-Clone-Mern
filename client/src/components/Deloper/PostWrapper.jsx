import React, { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const PostWrapper = () => {
  const posts = useSelector((state) => state.mediaFeed);
  const [activePostId, setActivePostId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!posts?.posts) return;

    const container = containerRef.current;
    if (!container) return;

    const postElements = container.querySelectorAll("[data-id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const id = entry.target.getAttribute("data-id");
            setActivePostId(id);
          }
        });
      },
      { threshold: [0.7] }
    );

    postElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [posts]);

  // ✅ Clear render flow
  if (posts.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!posts.loading && posts?.posts?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No posts available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex mt-4 flex-col relative w-full md:max-w-2xl overflow-hidden"
    >
      {posts?.posts?.map((post) => (
        <div key={post._id} data-id={post._id}>
          <PostCard post={post} isActive={activePostId === post._id} />
        </div>
      ))}
    </div>
  );
};

export default PostWrapper;
