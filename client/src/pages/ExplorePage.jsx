import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoPost from "../components/Deloper/VideoPost";
import { Heart, Video, View, X } from "lucide-react";
import {
  getAllUnlikedPosts,
  getAllUnlikedReels,
  getPostById,
  getReelById,
} from "../Redux/Services/mediaFeedThunk";
import FollowUnFolowButton from "../components/Deloper/FollowUnFolowButton";
import { addAndRemoveLike } from "../Redux/Slice/UserSlice";
import { like } from "../Redux/Services/UserThunk";
import { addComment, getAllComments } from "../Redux/Services/mediaUploadThunk";
import CommentShowingDiv from "../components/Deloper/CommentShowingDiv";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const reels = useSelector((state) => state.mediaFeed.reels);
  const posts = useSelector((state) => state.mediaFeed.posts);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const shuffledContent = useMemo(() => {
    const combinedContent = [
      ...(posts || []).map((post) => ({ ...post, contentType: "post" })),
      ...(reels || []).map((reel) => ({ ...reel, contentType: "reel" })),
    ];
    const shuffled = [...combinedContent];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [posts, reels]);

  const handleClick = async (id, contentType) => {
    try {
      if (contentType === "reel") {
        const data = await dispatch(getReelById(id));
        setSelectedData(data.payload.reel);
      } else {
        const data = await dispatch(getPostById(id));
        setSelectedData(data.payload.post);
      }
      setModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(selectedData, "selectedData");

  // Ensure background doesn't scroll while modal open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  const handleChooser = () => {
    // selectedData can be a post (with media array) or reel (maybe media string)
    const mediaArray = selectedData?.media;
    const isImage =
      selectedData?.mediaType === "image" ||
      (Array.isArray(mediaArray) &&
        mediaArray[0]?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    const videoSrc =
      Array.isArray(mediaArray) && mediaArray[0]?.url
        ? mediaArray[0].url
        : typeof mediaArray === "string"
        ? mediaArray
        : selectedData?.media?.url; // fallback

    if (isImage) {
      const src =
        Array.isArray(mediaArray) && mediaArray[0]?.url
          ? mediaArray[0].url
          : mediaArray?.url || "";
      return <img className="w-full h-full object-cover" src={src} alt="" />;
    } else {
      // For reliability in modal, use native video tag so aspect is preserved
      return (
        <video
          src={videoSrc}
          controls
          autoPlay
          className="w-full h-full object-cover"
        />
      );
    }
  };

  const handleChooser2 = (post, index) => {
    const overlay = (
      <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60 gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/60">
          <Heart />
          <span className="text-sm">{post.likeCount ?? 0}</span>
        </div>
        {post?.contentType === "reel" && (
          <div className="flex items-center gap-2 text-sm text-white/80">
            <View />
            <span>{selectedData?.viewCount ?? 0}</span>
          </div>
        )}
      </div>
    );

    const handleHoverEnter = () => {
      if (!isMobile) {
        setShow(true);
        setCurrentIndex(post._id);
      }
    };
    const handleHoverLeave = () => {
      if (!isMobile) {
        setShow(false);
        setCurrentIndex(null);
      }
    };

    const mediaElement =
      post.mediaType === "image" ? (
        <img
          src={post?.media?.[0]?.url}
          alt="post"
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <video
            src={post?.media?.[0]?.url || post?.media}
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <Video className="absolute top-2 right-2 text-white" />
        </>
      );

    return (
      <div
        key={post._id || index}
        onClick={() => handleClick(post._id, post.contentType)}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        className="w-full relative aspect-[3/4] bg-neutral-900 cursor-pointer"
      >
        {(isMobile || (show && currentIndex === post._id)) && overlay}
        {mediaElement}
      </div>
    );
  };

  const handlelikes = async (postId, type) => {
    dispatch(addAndRemoveLike(postId));
    try {
      const likeData = await dispatch(
        like({
          targetId: postId,
          targetType: type == "post" ? "Post" : "Reel",
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
  useEffect(() => {
    (async () => {
      await dispatch(getAllUnlikedReels());
      await dispatch(getAllUnlikedPosts());
    })();
  }, []);

  useEffect(() => {
    if (selectedData._id) {
      const handleMessageCircleClick = async () => {
        try {
          const results = await dispatch(getAllComments(selectedData._id));
          console.log(results.payload.comments);
          setComments(results.payload.comments);
        } catch (error) {
          console.error(error);
        }
      };
      handleMessageCircleClick();
    }
  }, [selectedData]);

  const addComments = async () => {
    try {
      const data = {
        mediaId: selectedData._id,
        comment,
      };
      const result = await dispatch(addComment(data));
      console.log(result.payload.success, "result while adding the comment");
      if (result?.payload?.success) {
        setComments((prev) => [...prev, result.payload.comment]);
        setComment("");
        toast.success("Comment added successfully");
        return;
      }
      toast.error("Something went wrong");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid relative grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full min-h-screen overflow-y-scroll gap-2 p-2 sm:p-4 md:p-6">
      {modal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4">
          <button
            onClick={() => setModal(false)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white z-50"
          >
            <X strokeWidth={3} className="cursor-pointer" />
          </button>

          <div className="w-full max-w-[1100px] h-[90vh] flex flex-col md:flex-row bg-transparent rounded-md overflow-hidden">
            {/* Left: Media */}
            <div
              className={`w-full md:w-2/3 ${
                isMobile ? "h-2/3" : "h-full"
              } bg-black flex items-center justify-center`}
            >
              <div className="w-full h-full flex items-center justify-center p-4">
                {/* Keep media centered and contained so it won't crop */}
                <div className="w-full h-full flex items-center justify-center">
                  {handleChooser()}
                </div>
              </div>
            </div>

            {/* Right: Comments / details */}
            <div
              className={`w-full md:w-1/3 ${
                isMobile ? "h-1/3" : "h-full"
              } bg-[#212328] text-white flex flex-col`}
            >
              {/* Header: post info */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    <div  className="w-10 h-10 cursor-pointer rounded-full bg-slate-600 flex items-center justify-center text-sm">
                      <img
                        src={selectedData?.userId?.avatar}
                        className="w-full h-full object-cover rounded-full"
                        alt=""
                      />
                    </div>
                    <div onClick={() => navigate(`/profile/${selectedData?.userId?._id}`)} className="cursor-pointer">
                      <div className="font-semibold text-sm">
                        {selectedData?.userId?.userName || "unknown"}
                        <FollowUnFolowButton
                          id={selectedData?.userId?._id}
                          border={"border-none"}
                          clr={"text-blue-500"}
                        />
                      </div>
                      <div className="text-xs text-white/60">
                        {selectedData?.caption || ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlelikes(selectedData._id, selectedData?.contentType);
                    }}
                    className={`cursor-pointer transition-transform duration-200 active:scale-125`}
                  >
                    {data?.userLikes.includes(selectedData._id) ? (
                      <Heart className="w-7 h-7 cursor-pointer text-red-500 fill-red-500 transition-all duration-200" />
                    ) : (
                      <Heart className="w-7 h-7 cursor-pointer text-white transition-all duration-200" />
                    )}
                  </div>
                  {selectedData?.contentType === "reel" && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <View />
                      <span>{selectedData?.viewCount ?? 0}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Comments list (dummy for now) */}
              <div className="px-4 py-3 flex-1 h-96  overflow-y-auto hide-scrollbar">
                <div className="space-y-3">
                  {comments && comments.length > 0 ? (
                    comments.map((c, index) => (
                      <CommentShowingDiv
                        key={index}
                        c={c}
                        index={index}
                        setComments={setComments}
                        noReply
                      />
                    ))
                  ) : (
                    <div className="text-white text-center">
                      No comments yet
                    </div>
                  )}
                </div>
              </div>

              {/* Comment input (dummy) */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border border-white/10 py-2 px-3 rounded text-white placeholder:text-white/40 focus:outline-none"
                  />
                  {comment && (
                    <button
                      onClick={addComments}
                      className="px-3 py-2 cursor-pointer bg-white/10 rounded text-white"
                    >
                      Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {shuffledContent.map((post, index) => handleChooser2(post, index))}
    </div>
  );
};

export default ExplorePage;
