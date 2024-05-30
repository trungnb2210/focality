import { useState } from "react";
import "../../globals.css"
import Link from "next/link"
import { IoIosArrowBack } from "react-icons/io"

interface NavBarProps {
  brandName: string;
}

function NavBar({brandName}: NavBarProps) {

  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 h-[56px] px-[16px]
    ">
      <div className="max-w-screen-xl flex flex-wrap items-center mx-auto">
        <div className="pt-[16px] flex-none">
            <Link href = "#">
                <IoIosArrowBack size={24}/>
            </Link>
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
