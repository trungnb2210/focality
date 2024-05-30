import React from 'react';
import NavBar from './NavBar';
import { FaPlus } from "react-icons/fa6";
import "../../globals.css";

interface IngredientItemAddProps {
    label: string;
  }

const IngredientItemAdd: React.FC<IngredientItemAddProps> = ({ label }) => {
    return (
      <button className="flex justify-between items-center w-[343px] h-[54px] bg-[#4F6367]
        rounded-[14px] text-white">
        <span className="w-full">{label}</span>
        <div className="mr-[14px]">
            <FaPlus size={24}/>
        </div>
      </button>
    );
  };

export default IngredientItemAdd;
