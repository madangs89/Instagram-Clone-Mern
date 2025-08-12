import { formatDistanceToNow } from "date-fns";
import { Trash } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../Redux/Services/mediaUploadThunk";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const CommentShowingDiv = ({ c, noReply, setComments }) => {
  const user = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDeleteComment = async (id) => {
    try {
      const data = await dispatch(deleteComment(id));
      console.log(data.payload, "delete comment");
      if (data?.payload?.success) {
        setComments((prev) => prev.filter((c) => c._id != id));
        toast.success("Comment deleted successfully");
        return;
      }
      toast.error("Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-start gap-3">
      {/* Avatar placeholder */}
      <div className="w-10 h-10 rounded-full bg-gray-700">
        <img
          src={c.userId.avatar}
          className="rounded-full w-full h-full object-cover"
          alt=""
        />
      </div>
      <div onClick={()=>navigate(`/profile/${c.userId._id}`)} className="flex-1 cursor-pointer flex items-center justify-between">
        <div className="">
          <div className="text-white font-semibold text-sm">
            {c.userId.userName}{" "}
            <span className="text-gray-300 font-normal">{c.comment}</span>
          </div>
          <div className="text-xs text-gray-400 flex gap-3 mt-1">
            <span>
              •{" "}
              {formatDistanceToNow(new Date(c.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        {user === c.userId._id && (
          <Trash
            onClick={() => handleDeleteComment(c._id)}
            className="w-3 h-3 text-red-400 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default CommentShowingDiv;
