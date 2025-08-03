import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAndRemoveFollower } from "../../Redux/Slice/UserSlice";
import { followUser, unFollowUser } from "../../Redux/Services/UserThunk";
import { toast } from "sonner";

const FollowUnFolowButton = ({ id, clr, border }) => {
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleFollowAndUnFollow = async (id) => {
    dispatch(addAndRemoveFollower(id));
    console.log("clicking", data?.following?.includes(id));
    if (data?.following?.includes(id)) {
      try {
        const result = await dispatch(unFollowUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to unfollow the user`);
        }
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    } else {
      try {
        const result = await dispatch(followUser(id));
        if (!result?.payload?.success) {
          // rollback on failure
          dispatch(addAndRemoveFollower(id));
          toast.error(`Failed to follow the user`);
        }
      } catch (error) {
        dispatch(addAndRemoveFollower(id));
        console.error(error);

        toast.error("Something went wrong ");
      }
    }
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleFollowAndUnFollow(id);
      }}
      className={` ${clr ? clr : "text-white "} text-sm font-semibold ${
        border ? border : "border"
      } border-white cursor-pointer rounded-md px-2 py-1`}
    >
      {data?.following?.includes(id) ? "Followed" : "Follow"}
    </button>
  );
};

export default FollowUnFolowButton;
