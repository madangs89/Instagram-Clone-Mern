import React, { useState } from "react";
import Search from "../components/Deloper/Search";

const Searchpage = () => {
  const [searchShow, setSearchShow] = useState(false);
  return (
    <div className="flex-1">
      <Search searchShow={searchShow} setSearchShow={setSearchShow} />
      
    </div>
  );
};

export default Searchpage;
