import React from "react";
import { Button } from "../ui/button";
const AuthNav = ({ login, setLogin }) => {
  return (
    <nav className="w-full px-6 py-4 border-b border-[#2a2a2a] flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="text-xl font-semibold tracking-wide text-white">
        <span className="text-blue-500">Lux</span>Auth
      </div>
      <div>
        <Button
          onClick={() => setLogin(!login)}
          variant="link"
          className="text-sm text-blue-400 hover:underline"
        >
          {login ? "Sign Up" : "Login"}
        </Button>
      </div>
    </nav>
  );
};

export default AuthNav;
