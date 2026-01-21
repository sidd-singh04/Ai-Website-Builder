import React from 'react';
import { FaStar } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
      {/* Navbar Container */}
      <div className="nav flex items-center justify-between px-6 md:px-[120px] h-[70px]">
        
        {/* Logo */}
        <div className="logo">
          <h3 className="text-[25px] font-bold bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
            WebBuilder
          </h3>
        </div>

        {/* Desktop Tagline (Uniform Gradient) */}
        <div className="hidden md:flex items-center gap-[25px]">
          <span className="text-[18px] font-medium bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent select-none tracking-wide">
            Think
          </span>
          <span className="text-[18px] font-medium bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent select-none tracking-wide">
            Prompt
          </span>
          <span className="text-[18px] font-medium bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent select-none tracking-wide">
            Generate
          </span>
        </div>

        {/* Mobile Decorative Icon (Not Clickable) */}
        <div className="md:hidden text-[22px] text-violet-500">
          <FaStar />
        </div>
      </div>
    </>
  );
};

export default Navbar;

