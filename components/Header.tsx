"use client";
import { useBoardStore } from "@/store/BoardStore";
import { UserButton } from "@clerk/nextjs";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React from "react";

const Header = () => {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        {/* gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-red-400 to-[#0355F1] rounded-md filter blur-3xl opacity-3xl -z-50 " />

        {/* Logo */}
        <Image
          src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL3JtNDY3YmF0Y2gzLWhhbmQtMDA1XzEucG5n.png"
          alt="logo"
          width={100}
          height={90}
          priority={true}
          className="w-24 md:w-16 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button hidden type="submit">
              Search
            </button>
          </form>

          {/* Avatar */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default Header;
