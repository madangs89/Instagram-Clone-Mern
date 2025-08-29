import React, { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const PostWrapper = () => {
  const posts = useSelector((state) => state.mediaFeed);
  const [activePostId, setActivePostId] = useState(null);
  const containerRer = useRef(null);

  useEffect(() => {
    const container = containerRer.current;
    if (!container) {
      return;
    }
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
      postElements.forEach((el) => observer.unobserve(el));
    };
  }, [posts]);

  if (posts.loading) {
    return <Loader />;
  }

  return (
    <div
      ref={containerRer}
      className="flex mt-4 flex-col relative w-full md:max-w-2xl overflow-hidden "
    >
      {posts?.posts.map((post) => (
        <div key={post._id} data-id={post._id}>
          <PostCard post={post} isActive={activePostId == post._id} />
        </div>
      ))}
    </div>
  );
};

export default PostWrapper;
