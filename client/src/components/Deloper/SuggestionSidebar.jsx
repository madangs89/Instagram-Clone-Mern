import React from "react";

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

const SuggestionSidebar = () => {
  return (
    <div className="w-full max-w-xs text-white px-4 py-4 space-y-4">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-700" />
          <div>
            <p className="text-sm font-semibold">madan_g_s_naik</p>
            <p className="text-xs text-neutral-500"> </p>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold">Switch</button>
      </div>

      {/* Suggestions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400 font-semibold">Suggested for you</p>
        <button className="text-xs font-medium">See All</button>
      </div>

      <div className="space-y-3">
        {dummySuggestions.map((user, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-neutral-500 truncate w-36">{user.info}</p>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-[10px] text-neutral-500 leading-snug pt-4">
        <p>
          About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language • Meta Verified
        </p>
        <p className="pt-2">© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default SuggestionSidebar;
