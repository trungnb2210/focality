"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

interface NavBarProps {
  brandName: string;
}

function NavBar({ brandName }: NavBarProps) {
  const router = useRouter();

  return (
    <nav className="h-[56px] px-[16px] w-screen mb-3">
      <div className="max-w-screen-xl flex items-center mx-auto">
        <button onClick={router.back} className="flex-none pt-[16px]">
          <IoIosArrowBack size={24} />
        </button>
        <div className="flex-grow text-center pt-[16px]">
          <div className="text-lg font-bold text-[16px]">{brandName}</div>
        </div>
        <div className="flex-none pt-[16px]" style={{ width: "24px" }}></div>
      </div>
    </nav>
  );
}

export default NavBar;