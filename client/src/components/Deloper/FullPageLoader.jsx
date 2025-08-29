import React from "react";
import Loader from "./Loader";

const FullPageLoader = () => {
  return (
    <div className="flex-1 flex items-center h-screen justify-center bg-black bg-opacity-60 z-50">
      <div className="flex flex-col justify-center items-center gap-4">
        {/* Spinner */}
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
