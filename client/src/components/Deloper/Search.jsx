import React, { useEffect, useState } from "react";
import { ArrowUp, Search as Sea, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { searchUser } from "../../Redux/Services/UserThunk";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
const Search = ({ searchShow, setSearchShow }) => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userName.length === 0) {
      setSearchShow(false);
    }
    if (userName.length > 0) {
      setLoading(true);
      setSearchShow(true);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const newT = setTimeout(() => {
        (async () => {
          const data = await dispatch(searchUser(userName));
          console.log(data, "search data");
          setSearchResults(data.payload.users);
          setLoading(false);
        })();
      }, 1000);
      setSearchTimeout(newT);
    }
  }, [userName]);
  return (
    <div className="w-full sticky top-0 left-0 z-[100] bg-black py-3 flex flex-col items-center">
      {/* Search Bar */}
      <div className="w-[90%] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full px-4 h-10 rounded-full bg-[#262626]">
          <Sea strokeWidth={3} className="w-[18px] h-[18px] text-white" />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Search..."
            className="flex-1 text-white bg-transparent border-none outline-none text-sm"
          />
        </div>
        {searchShow && (
          <X
            onClick={() => setSearchShow(false)}
            strokeWidth={3}
            className="w-[18px] h-[18px] text-white cursor-pointer hover:scale-110 transition"
          />
        )}
      </div>
      <div
        style={{ height: searchShow ? "30vh" : "0px" }}
        className="w-[90%] hide-scrollbar overflow-y-auto transition-all duration-300 ease-in-out mt-3"
      >
        <div className="flex flex-col gap-3">
          {loading && (
            <div className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition">
              <Loader />
            </div>
          )}
          {searchResults &&
            searchResults.length > 0 &&
            !loading &&
            searchResults.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/profile/${item._id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-white text-sm font-semibold">
                    {item.userName}
                  </p>
                  <p className="text-[#9a9a9a] text-xs">
                    {item.name} • {item.followers.length} followers
                  </p>
                </div>
              </div>
            ))}
          {searchResults.length === 0 && !loading && (
            <div className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition">
              <p className="text-white text-sm font-semibold">No User Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
