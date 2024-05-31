"use client";

import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";

interface IngredientItemProps {
    label: string;
    onRemove: () => void; // Callback for remove action
}

const IngredientItem: React.FC<IngredientItemProps> = ({ label, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="relative w-[343px] h-[54px] rounded-[14px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367]
          text-white drop-shadow-lg transition duration-300 ease-in-out"
          onClick={onRemove}
        >
          <span className="ml-5">{label}</span>
          {/* {isHovered && (
            <IoCloseOutline className="mr-5 text-white" size={24}/>
          )} */}
            {isHovered && (
            <div className="absolute inset-0 bg-[#FE5F55] bg-opacity-70 flex items-center justify-center">
                <span className="text-white font-bold">Remove Item</span>
            </div>
            )}
        </button>
      </div>
    );
};

export default IngredientItem;
