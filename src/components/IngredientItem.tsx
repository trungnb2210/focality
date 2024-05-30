import React from 'react';
import NavBar from './NavBar';
import { IoCloseOutline } from "react-icons/io5";

interface IngredientItemProps {
    label: string;
  }

const IngredientItem: React.FC<IngredientItemProps> = ({ label }) => {
    return (
      <button className="flex justify-between items-center w-[343px] h-[54px] bg-[#4F6367]
        rounded-[14px] text-white">
        <span className="w-full">{label}</span>
        <div className="mr-[14px]">
            <IoCloseOutline size={24}/>
        </div>
      </button>
    );
  };

export default IngredientItem;
