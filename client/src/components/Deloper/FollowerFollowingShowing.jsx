import React, { useEffect, useRef, useState } from "react";
import CommentShowingDiv from "./CommentShowingDiv";
import { useNavigate } from "react-router-dom";
import { addAndRemoveFollower } from "../../Redux/Slice/UserSlice";
import {
  followUser,
  getFollowAndFollowingUsers,
  getUser,
  unFollowUser,
} from "../../Redux/Services/UserThunk";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "./Loader";

const FollowerFollowingShowing = ({ onClose, F, id }) => {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showingData, setShowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await dispatch(getFollowAndFollowingUsers(id));
      if (F == "followers" || F == "Followers") {
        setShowingData(data?.payload?.user?.followers);
      } else if (F === "following" || F === "Following") {
        setShowingData(data?.payload?.user?.following);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!data.getCurrentUser._id) {
      dispatch(getUser(id));
    }
  }, [id, data.getCurrentUser, dispatch]);

  const handleFollowAndUnFollow = async (id) => {
    dispatch(addAndRemoveFollower(id));
    console.log("clicking", data?.following?.includes(id));
    if (data?.following?.includes(id)) {
      try {
        setLoading(true);
        const result = await dispatch(unFollowUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to unfollow the user`);
        }
        setLoading(false);
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    } else {
      try {
        setLoading(true);
        const result = await dispatch(followUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to follow the user`);
        }
        setLoading(false);
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    }
  };
  return (
    <div className="fixed inset-0 z-[50000] bg-black/70 flex justify-center items-end md:items-center">
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-black w-full md:w-[500px] max-w-full border h-[70vh] md:h-[500px] flex flex-col"
      >
        {/* Header */}
        <div className="text-center py-3 my-3 font-semibold border-b border-white/10 text-white">
          {F}
        </div>
        {/* Scrollable Comments */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {!loading && showingData && showingData.length > 0 ? (
            showingData.map((d, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3"
              >
                <div
                  onClick={() => {
                    navigate(`/profile/${d?._id}`);
                    onClose();
                  }}
                  className="flex items-center cursor-pointer space-x-3"
                >
                  <img
                    src={d?.avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="text-sm font-semibold">{d?.userName}</div>
                </div>
                <button
                  onClick={() => handleFollowAndUnFollow(d?._id)}
                  className="text-xs font-[600] cursor-pointer border border-neutral-600 rounded-md px-3 py-1 flex items-center justify-center text-white"
                >
                  {data?.following?.includes(d?._id) ? "Followed" : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <Loader />
          )}
          {!loading && showingData && showingData.length === 0 && (
            <div className="text-white text-center">No {F} yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerFollowingShowing;
