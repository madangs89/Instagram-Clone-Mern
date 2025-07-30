import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setMuted } from "../../Redux/Slice/UserSlice";

export default function VideoPost({ src, isActive }) {
  const videoRef = useRef(null);
  //   const [isMuted, setIsMuted] = useState(true);

  const isMuted = useSelector((state) => state.user.isMuted);
  const dispatch = useDispatch();

  const toggleMute = (e) => {
    e.stopPropagation(); // prevent togglePlayPause
    dispatch(setMuted());
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted; // may still be true on initial load
      video.play().catch((e) => console.warn("Autoplay failed:", e));
    } else {
      video.pause();
    }
  }, [isActive, isMuted]);

  return (
    <div
      className="relative w-full aspect-square bg-black"
      onClick={handlePlayPause}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        loop
        autoPlay
      />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-1 left-2 bg-black bg-opacity-50 p-1 rounded-full text-white"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
