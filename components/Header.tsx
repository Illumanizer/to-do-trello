"use client";
import { useBoardStore } from "@/store/BoardStore";
// import { createContext } from 'react'

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React from "react";
import Avatar from "react-avatar";

const Header = () => {
    const [searchString,setSearchString]=useBoardStore((state)=>[
        state.searchString,
        state.setSearchString,
    ])
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        {/* gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-red-400 to-[#0355F1] rounded-md filter blur-3xl opacity-3xl -z-50 " />

        {/* Logo */}
        <Image
          src="https://prod.cloud.rockstargames.com/crews/sc/0412/11026292/publish/emblems/bdab0622822cde7cb25031ccd501f886cbc382be_512.png"
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
              onChange={(e)=> setSearchString(e.target.value)}
            />
            <button hidden type="submit">
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Pranav Singh" color="#184563" size="50" round />
        </div>
      </div>
    </header>
  );
};

export default Header;
