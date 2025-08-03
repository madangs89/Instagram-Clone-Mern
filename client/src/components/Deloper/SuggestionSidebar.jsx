import { useDispatch, useSelector } from "react-redux";
import { getSugestedUser } from "../../Redux/Services/UserThunk";
import { useEffect } from "react";
import Loader from "./Loader";

const dummySuggestions = [
  {
    username: "yn_brian_17",
    info: "Following shetty_boy_prashu",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    username: "alliance_hudugaru",
    info: "Followed by ashwith_11 + 3 more",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    username: "sahilll_13__",
    info: "Followed by rebel_demon_1397 ...",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    username: "dhanush_s_sogedh",
    info: "Followed by _x_jaan_x02 + 15 more",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    username: "_manju_aryaa",
    info: "Followed by karthik.pnaik.58 and ...",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
];

import FollowUnFolowButton from "./FollowUnFolowButton";
import { useNavigate } from "react-router-dom";
const SuggestionSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggested = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      try {
        const data = dispatch(getSugestedUser());
        console.log(data, "in suggestion");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-xs text-white px-4 py-4 space-y-4">
      {/* Top Section */}
      <div className="flex items-center  justify-between">
        <div
          onClick={() => navigate(`/profile/${suggested._id}`)}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-700">
            <img
              src={suggested.avatar}
              className="w-full h-full object-cover rounded-full"
              alt=""
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{suggested.userName}</p>
            <p className="text-xs text-neutral-500"> </p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 cursor-pointer text-xs font-semibold"
        >
          Refresh
        </button>
      </div>

      {/* Suggestions */}

      {suggested.sugestedUser && suggested.sugestedUser.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400 font-semibold">
            Suggested for you
          </p>
          <button className="text-xs font-medium">See All</button>
        </div>
      )}

      {suggested.sugestedUser && suggested.sugestedUser.length > 0 ? (
        <div className="space-y-3">
          {suggested.sugestedUser.map((user, index) => (
            <div
              onClick={() => navigate(`/profile/${user._id}`)}
              className="flex items-center cursor-pointer justify-between"
              key={index}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{user.userName}</p>
                  <p className="text-xs text-neutral-500 truncate w-36">
                    {user.name}
                  </p>
                </div>
              </div>
              <FollowUnFolowButton
                clr="text-blue-500"
                border="none"
                id={user._id}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 font-semibold">No suggestions</p>
      )}

      <div className="text-[10px] text-neutral-500 leading-snug pt-4">
        <p>
          About • Help • Press • API • Jobs • Privacy • Terms • Locations •
          Language • Meta Verified
        </p>
        <p className="pt-2">© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default SuggestionSidebar;
