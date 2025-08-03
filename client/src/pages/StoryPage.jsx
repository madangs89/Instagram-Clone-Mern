import { formatDistanceToNow } from "date-fns";
import { Pause, Play, Volume2, VolumeOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { curretStoryView, veiwStory } from "../Redux/Services/mediaFeedThunk";
import { resetStoryView, updateStoryView } from "../Redux/Slice/mediaFeedSlice";
import VisibleModle from "../components/Deloper/VisibleModle";
import Loader from "../components/Deloper/Loader";
import FullPageLoader from "../components/Deloper/FullPageLoader";

const StoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [show, setShow] = useState(false);
  const d = useSelector((state) => state.mediaFeed);
  const userData = useSelector((state) => state.user);
  const storyList = d?.filteredStory;

  const [adjustedList, setAdjustedList] = useState([]);

  const [state, setState] = useState({
    userIndex: 0,
    mediaIndex: 0,
    play: true,
    mute: true,
    progress: [],
  });

  const { userIndex, mediaIndex, play, mute, progress } = state;
  const currentUser = adjustedList[userIndex];
  const currentMedia = currentUser?.media?.[mediaIndex];

  const progressTimerRef = useRef(null);
  const prevUserIdRef = useRef(null); // ✅ added to track previous userId

  const onClose = () => {
    setShow(false);
  };

  useEffect(() => {
    const excludeSelf = storyList.filter((s) => s.userId !== userData._id);
    const fullList = storyList;
    const listToUse = id === userData._id ? fullList : excludeSelf;

    setAdjustedList(listToUse);
    const index = listToUse.findIndex((s) => s.userId === id);

    if (index !== -1) {
      const userChanged = prevUserIdRef.current !== id;
      setState((prev) => ({
        userIndex: index,
        mediaIndex: userChanged ? 0 : prev.mediaIndex,
        play: true,
        mute: false,
        progress: listToUse[index]?.media.map(() => ({ percent: 0 })),
      }));
      prevUserIdRef.current = id;
    }
  }, [id, storyList]);

  const isFullSawOrWhat = (media) => {
    return media.every((item) => item.seen);
  };

  useEffect(() => {
    if (!currentMedia) return;
    clearInterval(progressTimerRef.current);

    if (show) {
      if (currentMedia.mediaType === "video" && videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    if (currentMedia.mediaType === "image") {
      progressTimerRef.current = setInterval(() => {
        setState((prev) => {
          const currentPercent = prev.progress[mediaIndex]?.percent || 0;
          const newPercent = currentPercent + 5;
          const updated = [...prev.progress];
          updated[mediaIndex] = {
            percent: newPercent >= 100 ? 100 : newPercent,
          };

          if (newPercent >= 100) {
            clearInterval(progressTimerRef.current);
            if (setShow) {
              setShow(false);
            }

            const isLastUser = userIndex === adjustedList.length - 1;
            const isLastMedia =
              mediaIndex === adjustedList[userIndex].media.length - 1;

            if (isLastUser && isLastMedia) {
              navigate("/");
            } else {
              handleNext();
            }
          }

          return { ...prev, progress: updated };
        });
      }, 100);
    } else {
      setState((prev) => {
        const updated = [...prev.progress];
        updated[mediaIndex] = { percent: 0 };
        return { ...prev, progress: updated };
      });
      if (videoRef.current) {
        videoRef.current.muted = mute;
        if (play) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    }

    return () => clearInterval(progressTimerRef.current);
  }, [mediaIndex, currentMedia, show]);

  useEffect(() => {
    if (
      currentMedia &&
      !currentMedia.seen &&
      currentUser.userId != userData._id
    ) {
      dispatch(veiwStory(currentMedia.storyId)).then((res) => {
        if (res.payload?.success) {
          dispatch(
            updateStoryView({
              userId: currentUser.userId,
              storyId: currentMedia.storyId,
            })
          );
        }
      });
    }
  }, [currentMedia]);

  useEffect(() => {
    if (currentUser?.userId == userData?._id) {
      dispatch(resetStoryView());
      (async () => {
        const data = await dispatch(curretStoryView(currentMedia.storyId));
        console.log(data.payload, "in story page");
      })();
    }
  }, [currentUser, currentMedia, userData]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const percent =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;

    setState((prev) => {
      const updated = [...prev.progress];
      updated[mediaIndex] = { percent };
      return { ...prev, progress: updated };
    });

    if (percent >= 99) {
      if (setShow) {
        setShow(false);
      }
      handleNext();
    }
  };

  const handleNext = () => {
    if (show) return;
    const user = adjustedList[userIndex];
    const hasMoreMedia = mediaIndex < user.media.length - 1;
    const hasMoreUsers = userIndex < adjustedList.length - 1;

    const updated = [...progress];
    updated[mediaIndex] = { percent: 100 };
    if (hasMoreMedia) {
      setState((prev) => ({
        ...prev,
        mediaIndex: prev.mediaIndex + 1,
        progress: updated,
      }));
    } else if (hasMoreUsers) {
      setState((prev) => ({
        ...prev,
        mediaIndex: 0,
        progress: adjustedList[userIndex + 1].media.map(() => ({ percent: 0 })),
      }));
      navigate(`/story/${adjustedList[userIndex + 1].userId}`);
    } else {
      if ((progress[mediaIndex]?.percent ?? 0) >= 100) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const updatedProgress = progress.map((item, index) => {
      if (index < mediaIndex) {
        return { percent: 100 };
      } else if (index === mediaIndex) {
        return { percent: progress[index]?.percent || 0 };
      } else {
        return { percent: 0 };
      }
    });

    setState((prev) => ({
      ...prev,
      progress: updatedProgress,
    }));
  }, [mediaIndex, state.userIndex]);

  const handlePrev = () => {
    if (show) return;
    if (mediaIndex > 0) {
      const updated = [...progress];
      updated[mediaIndex] = { percent: 0 };
      updated[mediaIndex - 1] = { percent: 0 };
      setState((prev) => ({
        ...prev,
        mediaIndex: prev.mediaIndex - 1,
        progress: updated,
      }));
    } else if (userIndex > 0) {
      navigate(`/story/${adjustedList[userIndex - 1].userId}`);
    }
  };

  const handleClick = (e) => {
    if (show) return;
    const mid = window.innerWidth / 2;
    e.clientX < mid ? handlePrev() : handleNext();
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (play) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setState((prev) => ({ ...prev, play: !prev.play }));
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !mute;
    setState((prev) => ({ ...prev, mute: !prev.mute }));
  };

  if (!currentUser || !currentMedia) {
    return <FullPageLoader />;
  }
  return (
    <div className="bg-black flex relative items-center justify-center overflow-hidden h-screen flex-1">
      {userIndex > 0 && (
        <div
          onClick={() => {
            if (show) {
              return;
            }
            navigate(`/story/${adjustedList[userIndex - 1].userId}`);
          }}
          className="absolute left-4 hidden top-1/2 -translate-y-1/2 z-50 cursor-pointer w-32 h-56 lg:flex flex-col items-center group"
        >
          {adjustedList[userIndex - 1].media[0]?.mediaType === "video" ? (
            <video
              src={adjustedList[userIndex - 1].media[0]?.url}
              className="w-full h-full object-cover rounded-md border border-white/50"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={adjustedList[userIndex - 1].media[0]?.url}
              className="w-full h-full object-cover rounded-md border border-white/50"
              alt="Previous story"
            />
          )}
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className={`w-14 h-14 p-1 bg-transparent rounded-full border-[3px] ${
                isFullSawOrWhat(adjustedList[userIndex - 1].media)
                  ? "border-gray-500"
                  : "border-white"
              }`}
            >
              <img
                src={adjustedList[userIndex - 1].avatar}
                className="w-full h-full object-cover rounded-full"
                alt="avatar"
              />
            </div>
            <p className="text-white text-sm mt-1">
              {adjustedList[userIndex - 1].userName}
            </p>
          </div>
        </div>
      )}

      <div
        onClick={handleClick}
        className="w-full lg:w-[360px] h-[90vh] bg-black relative"
      >
        {currentMedia.mediaType === "video" ? (
          <div className="w-full h-full relative">
            <video
              src={currentMedia.url}
              autoPlay
              ref={videoRef}
              muted={mute}
              onEnded={handleNext}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-6 right-5 flex gap-3 z-[500000]"
            >
              {play ? (
                <Pause
                  className="cursor-pointer text-white w-4 h-4"
                  onClick={togglePlay}
                />
              ) : (
                <Play
                  className="cursor-pointer text-white w-4 h-4"
                  onClick={togglePlay}
                />
              )}
              {mute ? (
                <VolumeOff
                  className="cursor-pointer text-white w-4 h-4"
                  onClick={toggleMute}
                />
              ) : (
                <Volume2
                  className="cursor-pointer text-white w-4 h-4"
                  onClick={toggleMute}
                />
              )}
            </div>
          </div>
        ) : (
          <img
            src={currentMedia.url}
            className="w-full h-full object-cover"
            alt=""
          />
        )}
        <div className="absolute top-2 w-full px-2 flex gap-2 z-50">
          {currentUser.media.map((_, i) => (
            <div key={i} className="w-full h-1 bg-red-500">
              <div
                className="h-1 bg-white transition-[width] ease-linear"
                style={{ width: `${progress[i]?.percent ?? 0}%` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute top-4.5 z-[1000] flex flex-col left-2 rounded-lg w-full">
          <div
            onClick={() => navigate(`/profile/${currentUser.userId}`)}
            className="flex cursor-pointer gap-2 items-center"
          >
            <img
              src={currentUser.avatar}
              className="h-9 w-9 object-cover rounded-full"
            />
            <p className="text-white text-sm font-semibold">
              {currentUser.userId == userData._id
                ? "You"
                : currentUser.userName}
            </p>
            <p className="text-[#d4d4d4] text-[10px] font-semibold">
              •{" "}
              {formatDistanceToNow(new Date(currentMedia.createdAt), {
                addSuffix: true,
              })
                .split(" ")
                .slice(0, 3)
                .join(" ")}
            </p>
          </div>
        </div>
        {currentUser.userId === userData._id && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShow(true);
            }}
            className="absolute flex items-center text-white bottom-0 left-0 w-full"
          >
            {d.loading ? (
              <Loader />
            ) : (
              <div className="flex items-center cursor-pointer gap-2 w-full relative px-4 py-2">
                <p className="text-sm font-semibold">
                  {d?.curretStoryView.length} view{" "}
                  {d?.curretStoryView.length > 10 ? "s" : ""}
                </p>
                <div className="absolute left-16 flex ">
                  {d?.curretStoryView.map((data, i) => (
                    <div key={i} className="w-5 h-5">
                      <img
                        src={data.avatar}
                        className="w-full h-full object-cover rounded-full"
                        alt="avatar"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {show && <VisibleModle onClose={onClose} />}
      </div>

      {userIndex < adjustedList.length - 1 && (
        <div
          onClick={() => {
            if (show) {
              return;
            }
            navigate(`/story/${adjustedList[userIndex + 1].userId}`);
          }}
          className="absolute right-4 hidden top-1/2 -translate-y-1/2 z-50 cursor-pointer w-32 h-56 lg:flex flex-col items-center group"
        >
          {adjustedList[userIndex + 1].media[0]?.mediaType === "video" ? (
            <video
              src={adjustedList[userIndex + 1].media[0]?.url}
              className="w-full h-full object-cover rounded-md border border-white/50"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={adjustedList[userIndex + 1].media[0]?.url}
              className="w-full h-full object-cover rounded-md border border-white/50"
              alt="Next story"
            />
          )}
          <div className="absolute top-1/2  -translate-y-1/2 flex flex-col items-center">
            <div
              className={`w-14 h-14 bg-transparent p-1 rounded-full border-[3px] ${
                isFullSawOrWhat(adjustedList[userIndex + 1].media)
                  ? "border-gray-500"
                  : "border-white"
              }`}
            >
              <img
                src={adjustedList[userIndex + 1].avatar}
                className="w-full h-full object-cover rounded-full"
                alt="avatar"
              />
            </div>
            <p className="text-white text-sm mt-1">
              {adjustedList[userIndex + 1].userName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;
