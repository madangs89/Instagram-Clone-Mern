import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoPost from "../components/Deloper/VideoPost";
import {
  Heart,
  Video,
  View,
  X,
  MessageCircle,
  Share,
  Bookmark,
  ArrowLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
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
import Search from "../components/Deloper/Search";

const ExplorePage = () => {
  const reels = useSelector((state) => state.mediaFeed.reels);
  const posts = useSelector((state) => state.mediaFeed.posts);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  const [isMuted, setIsMuted] = useState(true);

  const [searchShow, setSearchShow] = useState(false);

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
      setShowAllComments(false);
      setIsMuted(true); // Reset mute state when opening new modal
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

  // Handle mute/unmute for mobile videos
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleChooser = () => {
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
        : selectedData?.media?.url;

    if (isImage) {
      const src =
        Array.isArray(mediaArray) && mediaArray[0]?.url
          ? mediaArray[0].url
          : mediaArray?.url || "";
      return <img className="w-full h-full object-cover" src={src} alt="" />;
    } else {
      // For mobile reel-style, for desktop keep controls
      return (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoSrc}
            controls={!isMobile}
            autoPlay={isMobile}
            muted={isMuted}
            loop={isMobile}
            playsInline
            className="w-full h-full object-cover"
          />
          {isMobile && (
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-10"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>
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
            <span>{post?.viewCount ?? 0}</span>
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

  const closeModal = () => {
    setModal(false);
    setSelectedData({});
    setComments([]);
    setComment("");
    setShowAllComments(false);
    setIsMuted(true);
  };

  return (
    <div className="overflow-y-scroll">
      <Search searchShow={searchShow} setSearchShow={setSearchShow} />
      <div className="grid relative grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full min-h-screen  gap-2 p-2 sm:p-4 md:p-6">
        {modal && (
          <div className="fixed inset-0 z-[10000] bg-black">
            {/* Mobile Modal */}
            {isMobile ? (
              <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
                {/* Show All Comments View */}
                {showAllComments ? (
                  <div className="flex flex-col h-full bg-black text-white">
                    {/* Comments Header */}
                    <div className="flex items-center p-4 border-b border-gray-800">
                      <button
                        onClick={() => setShowAllComments(false)}
                        className="mr-4"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <h2 className="text-lg font-semibold">Comments</h2>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                      <div className="space-y-4">
                        {comments && comments.length > 0 ? (
                          comments.map((c, index) => (
                            <CommentShowingDiv
                              key={`comment-${c._id || index}`}
                              c={c}
                              index={index}
                              setComments={setComments}
                              noReply
                            />
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No comments yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div className="p-4 border-t border-gray-800">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none"
                        />
                        {comment && (
                          <button
                            onClick={addComments}
                            className="text-blue-500 font-semibold"
                          >
                            Post
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Main Mobile View */
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedData?.userId?.avatar}
                          className="w-8 h-8 object-cover rounded-full"
                          alt=""
                        />
                        <div>
                          <div
                            onClick={() =>
                              navigate(`/profile/${selectedData?.userId?._id}`)
                            }
                            className="font-semibold text-sm cursor-pointer text-white"
                          >
                            {selectedData?.userId?.userName || "unknown"}
                          </div>
                        </div>
                      </div>
                      <button onClick={closeModal} className="p-2">
                        <X size={24} className="text-white" />
                      </button>
                    </div>

                    {/* Media - Keep original size */}
                    <div className="flex items-center justify-center bg-black">
                      {handleChooser()}
                    </div>

                    {/* Action Buttons - Below Media */}
                    <div className="flex items-center justify-between px-4 py-3 bg-black">
                      <div className="flex items-center gap-4">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handlelikes(
                              selectedData._id,
                              selectedData?.contentType
                            );
                          }}
                          className="cursor-pointer"
                        >
                          {data?.userLikes.includes(selectedData._id) ? (
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                          ) : (
                            <Heart className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="cursor-pointer">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="cursor-pointer">
                          <Share className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {selectedData?.contentType === "reel" && (
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <View className="w-5 h-5" />
                          <span>{selectedData?.viewCount ?? 0}</span>
                        </div>
                      )}
                    </div>

                    {/* Likes Count */}
                    <div className="px-4 pb-2 bg-black">
                      <span className="text-white font-semibold text-sm">
                        {selectedData?.likeCount ?? 0} likes
                      </span>
                    </div>

                    {/* Caption */}
                    {selectedData?.caption && (
                      <div className="px-4 pb-3 bg-black">
                        <span className="text-white text-sm">
                          <span className="font-semibold mr-2">
                            {selectedData?.userId?.userName}
                          </span>
                          {selectedData.caption}
                        </span>
                      </div>
                    )}

                    {/* View Comments Button */}
                    <div className="px-4 pb-3 bg-black">
                      <button
                        onClick={() => setShowAllComments(true)}
                        className="text-gray-400 text-sm"
                      >
                        View all {comments.length} comments
                      </button>
                    </div>

                    {/* Comment Input */}
                    <div className="p-4 border-t border-gray-800 bg-black">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none"
                        />
                        {comment && (
                          <button
                            onClick={addComments}
                            className="text-blue-500 font-semibold"
                          >
                            Post
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Desktop Modal - Keep Original */
              <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4">
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute top-4 right-4 text-white z-50"
                >
                  <X strokeWidth={3} className="cursor-pointer" />
                </button>

                <div className="w-full max-w-[1100px] h-[90vh] flex flex-col md:flex-row bg-transparent rounded-md overflow-hidden">
                  {/* Left: Media */}
                  <div className="w-full md:w-2/3 h-full bg-black flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="w-full h-full flex items-center justify-center">
                        {handleChooser()}
                      </div>
                    </div>
                  </div>

                  {/* Right: Comments / details */}
                  <div className="w-full md:w-1/3 h-full bg-[#212328] text-white flex flex-col">
                    {/* Header: post info */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 cursor-pointer rounded-full bg-slate-600 flex items-center justify-center text-sm">
                            <img
                              src={selectedData?.userId?.avatar}
                              className="w-full h-full object-cover rounded-full"
                              alt=""
                            />
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/profile/${selectedData?.userId?._id}`)
                            }
                            className="cursor-pointer"
                          >
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
                            handlelikes(
                              selectedData._id,
                              selectedData?.contentType
                            );
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

                    {/* Comments list */}
                    <div className="px-4 py-3 flex-1 h-96 overflow-y-auto hide-scrollbar">
                      <div className="space-y-3">
                        {comments && comments.length > 0 ? (
                          comments.map((c, index) => (
                            <CommentShowingDiv
                              key={`comment-${c._id || index}`}
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

                    {/* Comment input */}
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
          </div>
        )}
        {shuffledContent.map((post, index) => handleChooser2(post, index))}
      </div>
    </div>
  );
};

export default ExplorePage;
