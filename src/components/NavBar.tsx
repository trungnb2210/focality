"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { IoIosArrowBack } from "react-icons/io"
// import { useHistory } from "react-router-dom";

interface NavBarProps {
  brandName: string;
}

function NavBar({brandName}: NavBarProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back;
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 h-[56px] px-[16px] w-screen mb-3">
      <div className="max-w-screen-xl flex flex-wrap items-center mx-auto">
        <div className="pt-[16px] flex-none">
            <button onClick={router.back}>
                <IoIosArrowBack size={24}/>
            </button>
        </div>
        <div className="w-[199px] ml-[16px] mr-[16px] text-center pt-[16px] flex-auto">
            <div className="text-lg font-bold text-[16px] weight-[700]">{brandName}</div>
        </div>
        <div className="pt-[16px] flex-none">
            <IoIosArrowBack size={24} color="white"/>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
