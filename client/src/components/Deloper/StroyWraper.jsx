import React, { useEffect, useRef, useState } from "react";
import { dummyStories } from "../../utils/utilitity";
import Story from "./Story";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

const StroyWraper = () => {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
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
      {canScrollRight && (
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
        {dummyStories.map((story) => (
          <Story
            key={story.id}
            username={story.username}
            avatar={story.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default StroyWraper;
