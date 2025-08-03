import React, { useEffect, useRef, useState } from "react";
import { dummyStories } from "../../utils/utilitity";
import Story from "./Story";
import { CircleChevronLeft, CircleChevronRight, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFilteredStory } from "../../Redux/Slice/mediaFeedSlice";
import { isEqual } from "lodash"; // make sure lodash is installed
import { useNavigate } from "react-router-dom";
const StroyWraper = () => {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();
  const storyData = useSelector((state) => state.mediaFeed);
  const userData = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };
  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setScrollX(scrollLeft);
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  const existingFiltered = storyData.filteredStory;

  useEffect(() => {
    const now = new Date();
    const existingFiltered = storyData.filteredStory || [];

    // Clean expired stories from localStorage
    const localStoriesRaw = localStorage.getItem("viewedStories");
    let cleanedViewedStories = [];

    if (localStoriesRaw) {
      try {
        const parsed = JSON.parse(localStoriesRaw);
        cleanedViewedStories = parsed.filter((story) => {
          const expires = new Date(story.expiresAt);
          return expires > now;
        });
        localStorage.setItem(
          "viewedStories",
          JSON.stringify(cleanedViewedStories)
        );
      } catch (err) {
        console.error("Invalid viewedStories in localStorage:", err);
      }
    }

    // Group and process stories
    if (storyData?.story?.length > 0 && userData?._id) {
      const storyMap = new Map();

      storyData.story.forEach((story, index) => {
        const expires = new Date(story.expiresAt);
        if (expires <= now) return;

        const isSeen = cleanedViewedStories.some(
          (s) => s.userId === story.userId && s.storyId === story._id
        );

        const mediaItem = {
          url: story.mediaUrl,
          seen: isSeen,
          mediaType: story.mediaType,
          storyId: story._id,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,
        };

        if (!storyMap.has(story.userId)) {
          storyMap.set(story.userId, {
            userId: story.userId,
            currentIndex: index,
            userName: story.userSnapshot.userName,
            avatar: story.userSnapshot.avatar,
            createdAt: story.createdAt,
            media: [mediaItem],
            isSelf: story.userId === userData._id,
          });
        } else {
          storyMap.get(story.userId).media.push(mediaItem);
        }
      });

      const grouped = Array.from(storyMap.values()).sort((a, b) => {
        if (a.userId === userData._id) return -1;
        if (b.userId === userData._id) return 1;
        return 0;
      });
      // Only dispatch if grouped differs from existing filtered
      if (!isEqual(existingFiltered, grouped)) {
        dispatch(addFilteredStory(grouped));
      }
    }
  }, [storyData.story, storyData.filteredStory, userData._id, dispatch]);


  return (
    <div className="flex relative md:max-w-2xl overflow-hidden space-x-4">
      {canScrollLeft && (
        <span
          onClick={scrollLeft}
          className="cursor-pointer absolute left-3 top-10"
        >
          <CircleChevronLeft width={25} height={25} fill="#a3a3a3" />
        </span>
      )}
      {canScrollRight && storyData?.filteredStory?.length > 5 && (
        <span
          onClick={scrollRight}
          className="cursor-pointer absolute -right-2 top-10"
        >
          <CircleChevronRight width={25} height={25} fill="#a3a3a3" />
        </span>
      )}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-3 md:px-2 hide-scrollbar scroll-smooth"
      >
        {storyData.filteredStory.find((s) => s.userId === userData._id) ? (
          <Story
            key={userData._id}
            id={userData._id}
            username="Your Story"
            avatar={userData.avatar}
          />
        ) : (
          <div
            onClick={() => navigate("/create")}
            className="flex cursor-pointer flex-col items-center space-y-1"
          >
            <div className="w-[87px] relative h-[87px] rounded-full p-[3px]">
              <img
                src={userData.avatar || "/default-avatar.jpg"}
                alt={"madan"}
                className="w-full  border-[4px] border-black h-full object-fit rounded-full"
              />
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-white border-[2px] flex items-center justify-center border-black rounded-full">
                <Plus
                  style={{ strokeWidth: 3 }}
                  className="w-3 h-3 font-bold text-black"
                />
              </div>
            </div>

            <p className="text-xs text-center text-white truncate w-16">You</p>
          </div>
        )}

        {storyData.filteredStory
          .filter((s) => s.userId !== userData._id)
          .map((story) => {
            return (
              <Story
                media={story.media}
                key={story.userId}
                id={story.userId}
                username={story.userName}
                avatar={story.avatar}
              />
            );
          })}
      </div>
    </div>
  );
};

export default StroyWraper;
