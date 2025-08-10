import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { addAndRemoveLike, setMuted } from "../../Redux/Slice/UserSlice";
import Dialoger from "./Dialoger";
import FollowUnFolowButton from "./FollowUnFolowButton";
import { useNavigate } from "react-router-dom";
import { like } from "../../Redux/Services/UserThunk";
import {
  addComment,
  getAllComments,
} from "../../Redux/Services/mediaUploadThunk";
import ShareDialog from "./ShareDialog";

export default function ReelVedio({ src, isActive, reel }) {
  const videoRef = useRef(null);
  const isMuted = useSelector((state) => state.user.isMuted);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const data = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [reelId, setReelId] = useState(reel._id);

  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [sendingData, setSendingData] = useState({
    sender: data._id,
    tempId: Date.now(),
    media: [
      {
        url: reel.media,
        publicId: reel.publicId,
        type: "video",
      },
    ],
  });

  const onCloseShare = () => {
    setShowShare(false);
  };
  const toggleMute = (e) => {
    e.stopPropagation(); // prevent togglePlayPause
    dispatch(setMuted());
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent.toFixed(2)); // show as percentage
    }
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const onClose = () => {
    setShow(false);
  };

  const handlelikes = async (postId) => {
    dispatch(addAndRemoveLike(postId));
    try {
      const likeData = await dispatch(
        like({
          targetId: postId,
          targetType: "Reel",
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

  const handleMessageCircleClick = async (id) => {
    try {
      const results = await dispatch(getAllComments(id));
      console.log(results.payload.comments);
      setComments(results.payload.comments);
      if (results?.payload?.success) {
        setShow(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addComments = async (id) => {
    try {
      const data = {
        mediaId: id,
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    console.log("isActive", isActive);

    if (isActive) {
      video.muted = isMuted; // may still be true on initial load
      video.play().catch((e) => console.warn("Autoplay failed:", e));
    } else {
      video.pause();
    }
  }, [isActive, isMuted]);

  return (
    <div
      className="relative md:rounded-lg w-full h-full bg-black"
      onClick={handlePlayPause}
    >
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        className="w-full md:rounded-lg h-full object-cover"
        playsInline
        loop
        autoPlay
      />
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-1 right-2 bg-black bg-opacity-50 p-1 rounded-full text-white"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <div className="absolute md:hidden block bottom-0 left-0 rounded-lg w-full h-[2px] bg-gray-500">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-white transition-[width] duration-200 ease-linear"
        ></div>
      </div>

      <div className="absolute bottom-9 z-[1000] flex flex-col  left-5 rounded-lg w-full">
        <div className="h-full w-fit flex-col flex gap-2">
          <div
            onClick={() => navigate(`/profile/${reel?.userId?._id}`)}
            className="h-full  cursor-pointer w-full flex gap-4  items-center"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
              <img
                src={reel?.userId.avatar}
                className="w-full h-full border-1 border-black object-cover rounded-full"
                alt=""
              />
            </div>
            <p className="text-white text-sm font-semibold">
              {reel?.userId?.userName}
            </p>
            <FollowUnFolowButton id={reel?.userId?._id} />
          </div>
          <p className="text-white text-[13px] ml-2 font-semibold">
            {reel?.caption}
          </p>
        </div>
      </div>

      <div className="absolute bottom-16 gap-5 flex right-3 flex-col items-center justify-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlelikes(reel._id);
          }}
          className={`cursor-pointer transition-transform duration-200 active:scale-125`}
        >
          {data?.userLikes.includes(reel._id) ? (
            <Heart className="w-7 h-7 cursor-pointer text-red-500 fill-red-500 transition-all duration-200" />
          ) : (
            <Heart className="w-7 h-7 cursor-pointer text-white transition-all duration-200" />
          )}
        </div>
        <MessageCircle
          onClick={(e) => {
            e.stopPropagation();
            handleMessageCircleClick(reel._id);
          }}
          className="w-7 h-7 cursor-pointer text-white"
        />
        <Send
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(true);
          }}
          className="w-7 h-7 cursor-pointer z-[10000] text-white"
        />
      </div>

      {show && (
        <Dialoger
          addComments={addComments}
          setComments={setComments}
          comment={comment}
          comments={comments}
          setComment={setComment}
          onClose={onClose}
          reelId={reel._id}
        />
      )}

      {showShare && (
        <ShareDialog
          post={reel}
          sendingData={sendingData}
          setSendingData={setSendingData}
          onClose={onCloseShare}
        />
      )}
    </div>
  );
}
