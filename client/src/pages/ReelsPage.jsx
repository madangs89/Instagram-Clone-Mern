import React, { useEffect, useRef, useState } from "react";
import ReelVedio from "../components/Deloper/ReelVedio";
import { useDispatch, useSelector } from "react-redux";
import { getAllUnlikedReels } from "../Redux/Services/mediaFeedThunk";

const ReelsPage = () => {
  const [activeReelId, setActiveReelId] = useState(null);
  const containerRer = useRef(null);
  const navHeight = 60;
  // Inline style for mobile only
  const isMobile = window.innerWidth < 1024;
  const containerStyle = isMobile
    ? { height: `calc(100vh - ${navHeight}px)` }
    : {};

  const reels = useSelector((state) => state.mediaFeed.reels);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!reels || reels.length === 0) return;

    const container = containerRer.current;
    if (!container) return;

    const reelElements = container.querySelectorAll("[data-id]");
    console.log("Observing", reelElements.length, "elements");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("Observer Entry:", entry);
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const id = entry.target.getAttribute("data-id");
            setActiveReelId(id);
          }
        });
      },
      { threshold: [0.5] }
    );

    reelElements.forEach((el) => observer.observe(el));
    return () => {
      reelElements.forEach((el) => observer.unobserve(el));
    };
  }, [reels]);

  useEffect(() => {
    (async () => {
      const data = await dispatch(getAllUnlikedReels());
      console.log(data, "data");
    })();
  }, []);
  return (
    <div className="w-full h-screen bg-black flex overflow-hidden justify-center">
      <div
        className="overflow-y-scroll hide-scrollbar md:mt-3 md:pb-6 snap-y snap-mandatory lg:w-[400px] w-full flex flex-col items-center md:gap-4 h-screen"
        style={containerStyle}
        ref={containerRer}
      >
        {reels && reels.length > 0 ? (
          reels.map((reel, index) => (
            <div
              key={reel._id + index}
              data-id={reel?._id}
              className="flex-shrink-0 lg:w-[360px] w-full bg-blue-600 snap-start md:rounded-lg shadow-lg"
              style={
                isMobile
                  ? { height: `calc(100vh - ${navHeight}px)` }
                  : { height: "90vh" }
              }
            >
              <ReelVedio
                reel={reel}
                src={reel?.media}
                isActive={activeReelId == reel?._id}
              />
            </div>
          ))
        ) : (
          <div className="text-white text-2xl">No reels found</div>
        )}
      </div>
    </div>
  );
};

export default ReelsPage;
