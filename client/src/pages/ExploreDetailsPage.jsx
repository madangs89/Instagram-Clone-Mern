import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  View,
  X,
  MessageCircle,
  Share,
  Volume2,
  VolumeX,
  ArrowLeft,
} from "lucide-react";
import { getReelById, getPostById } from "../Redux/Services/mediaFeedThunk";
import { getAllComments, addComment } from "../Redux/Services/mediaUploadThunk";
import { addAndRemoveLike, addLikes } from "../Redux/Slice/UserSlice";
import { like } from "../Redux/Services/UserThunk";
import CommentShowingDiv from "../components/Deloper/CommentShowingDiv";
import FollowUnFolowButton from "../components/Deloper/FollowUnFolowButton";
import { toast } from "sonner";
import Loader from "../components/Deloper/Loader";

const ExploreDetailsPage = () => {
  const { id, type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);
  const [selectedData, setSelectedData] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMuted, setIsMuted] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (type === "reel") {
        const res = await dispatch(getReelById(id));
        setSelectedData(res.payload.reel);
        setLoading(false);
      } else {
        const res = await dispatch(getPostById(id));
        setSelectedData(res.payload.post);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type, dispatch]);

  useEffect(() => {
    if (selectedData._id) {
      dispatch(getAllComments(selectedData._id)).then((res) =>
        setComments(res.payload.comments || [])
      );
    }
    if (selectedData?.isLiked) {
      dispatch(addLikes(selectedData._id));
    }
  }, [selectedData, dispatch]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const handlelikes = async () => {
    dispatch(addAndRemoveLike(selectedData._id));
    try {
      const likeData = await dispatch(
        like({
          targetId: selectedData._id,
          targetType: selectedData.contentType === "post" ? "Post" : "Reel",
        })
      );
      if (!likeData?.payload?.success) {
        dispatch(addAndRemoveLike(selectedData._id));
      }
    } catch (error) {
      dispatch(addAndRemoveLike(selectedData._id));
    }
  };

  useEffect(() => {
    return () => {
      setSelectedData({});
      setComments([]);
      setComment("");
      setIsMobile(window.innerWidth < 768);
      setIsMuted(true);
      setShowAllComments(false);
    };
  }, []);

  const addComments = async () => {
    const result = await dispatch(
      addComment({
        mediaId: selectedData._id,
        comment,
        contentType: selectedData.contentType,
      })
    );
    if (result?.payload?.success) {
      setComments((prev) => [...prev, result.payload.comment]);
      setComment("");
    } else {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const renderMedia = () => {
    const mediaArray = selectedData?.media;
    const isImage =
      selectedData?.mediaType === "image" ||
      (Array.isArray(mediaArray) &&
        mediaArray[0]?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    const src =
      Array.isArray(mediaArray) && mediaArray[0]?.url
        ? mediaArray[0].url
        : mediaArray || "";

    if (isImage) {
      return (
        <img src={src} alt="" className="max-h-screen w-auto object-contain" />
      );
    } else {
      return (
        <div className="relative flex justify-center items-center">
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="max-h-screen w-auto object-contain"
          />
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
          >
            {isMuted ? (
              <VolumeX className="text-white" />
            ) : (
              <Volume2 className="text-white" />
            )}
          </button>
        </div>
      );
    }
  };
  /** ------------------ MOBILE LAYOUT ------------------ **/
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto  text-white flex flex-col">
        {!showAllComments ? (
          <>
            {/* Header */}
            <div className="flex items-center cursor-pointer justify-between p-3 border-b border-white/20">
              <div
                className="flex w-8 h-8 shrink-0 items-center gap-3"
                onClick={() =>
                  navigate(`/profile/${selectedData?.userId?._id}`)
                }
              >
                <img
                  src={selectedData?.userId?.avatar}
                  className="w-full h-full rounded-full object-cover"
                  alt=""
                />
                <span className="font-semibold text-white">
                  {selectedData?.userId?.userName}
                </span>
                {data?._id == selectedData?.userId?._id ? (
                  <span className="text-xs text-white/60">You</span>
                ) : (
                  <FollowUnFolowButton
                    id={selectedData?.userId?._id}
                    border="border-none"
                    clr="text-blue-500"
                  />
                )}
              </div>
              <X className="cursor-pointer" onClick={() => navigate(-1)} />
            </div>

            {/* Media */}
            <div className="flex-1 flex items-center justify-center bg-black">
              {renderMedia()}
            </div>

            {/* Actions */}
            <div className="p-3 flex items-center gap-4">
              <div onClick={handlelikes}>
                {data?.userLikes.includes(selectedData._id) ? (
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </div>
              <MessageCircle
                className="w-6 h-6"
                onClick={() => setShowAllComments(true)}
              />
              {selectedData?.contentType === "reel" && (
                <div className="ml-auto flex items-center gap-2">
                  <View className="w-5 h-5" />
                  <span>{selectedData?.viewCount ?? 0}</span>
                </div>
              )}
            </div>

            {/* Likes & Caption */}
            <div className="px-3 text-sm">
              <div>{selectedData?.likes?.length || 0} likes</div>
              <div>
                <span className="font-semibold mr-2">
                  {selectedData?.userId?.userName}
                </span>
                {selectedData?.caption}
              </div>
              <button
                className="text-white/50"
                onClick={() => setShowAllComments(true)}
              >
                View all comments
              </button>
            </div>

            {/* Add Comment */}
            <div className="p-3 flex items-center gap-2 border-t border-white/20">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none"
              />
              {comment && (
                <button
                  onClick={addComments}
                  className="text-blue-500 cursor-pointer"
                >
                  Post
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Comments Header */}
            <div className="flex items-center gap-3 p-3 border-b border-white/20">
              <ArrowLeft onClick={() => setShowAllComments(false)} />
              <span className="font-semibold">Comments</span>
            </div>
            {/* Comments List */}
            <div className="flex-1 flex flex-col gap-5  overflow-y-auto p-3">
              {comments.length ? (
                comments.map((c, i) => (
                  <CommentShowingDiv
                    key={i}
                    c={c}
                    noReply
                    setComments={setComments}
                  />
                ))
              ) : (
                <div className="text-center text-white/50">No comments yet</div>
              )}
            </div>
            {/* Add Comment */}
            <div className="p-3 flex items-center gap-2 border-t border-white/20">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none"
              />
              {comment && (
                <button
                  onClick={addComments}
                  className="text-blue-500 cursor-pointer"
                >
                  Post
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black/90">
      <div className="flex flex-col sm:flex-row w-full h-full max-w-7xl mx-auto bg-black rounded-lg overflow-hidden">
        {/* Left - Media */}
        <div className="flex-1 flex items-center justify-center bg-black h-full">
          {renderMedia()}
        </div>

        {/* Right - Sidebar */}
        <div className="w-[400px] flex flex-col bg-[#212328] h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#212328] z-10">
            <div className="flex items-center gap-3">
              <img
                src={selectedData?.userId?.avatar}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
              />
              <div>
                <div
                  onClick={() =>
                    navigate(`/profile/${selectedData?.userId?._id}`)
                  }
                  className="font-semibold text-white cursor-pointer text-sm flex items-center gap-2"
                >
                  {selectedData?.userId?.userName}
                  {data?._id == selectedData?.userId?._id ? (
                    <span className="text-xs text-white/60">You</span>
                  ) : (
                    <FollowUnFolowButton
                      id={selectedData?.userId?._id}
                      border="border-none"
                      clr="text-blue-500"
                    />
                  )}
                </div>
                <div className="text-xs text-white/60">
                  {selectedData?.caption || ""}
                </div>
              </div>
            </div>
            <button onClick={() => navigate(-1)}>
              <X className="text-white cursor-pointer" />
            </button>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            {comments.length ? (
              comments.map((c, index) => (
                <CommentShowingDiv
                  key={index}
                  c={c}
                  noReply
                  setComments={setComments}
                />
              ))
            ) : (
              <div className="text-center text-white/60">No comments yet</div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between bg-[#212328]">
            <div className="flex items-center gap-4">
              <div onClick={handlelikes} className="cursor-pointer">
                {data?.userLikes.includes(selectedData._id) ? (
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="w-6 h-6 text-white" />
                )}
              </div>
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            {selectedData?.contentType === "reel" && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <View className="w-5 h-5" />
                <span>{selectedData?.viewCount ?? 0}</span>
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-[#212328]">
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
                className="px-3 py-2 bg-white/10 rounded cursor-pointer text-white"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreDetailsPage;
