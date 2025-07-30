import React from "react";

const FullPageLoader = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">Loading Instagram...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
