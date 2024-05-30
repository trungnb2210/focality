"use client";

import React from 'react';
import NavBar from './NavBar';
import { FaPlus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

interface IngredientItemAddProps {
    label: string;
  }

const IngredientItemAdd: React.FC<IngredientItemAddProps> = ({ label }) => {
    const router = useRouter();
    // const { addIngredient } = useIngredientsContext();
    // const handleAddIngredient = (ingredient: string) => {
    //   addIngredient(ingredient);
    //   router.push("ingredients");
    // }

    return (
      <button
        className="flex justify-between items-center w-[343px] h-[54px] bg-[#4F6367]
        rounded-[14px] text-white">
        <span className="w-full">{label}</span>
        <div className="mr-[14px]">
            <FaPlus size={24}/>
        </div>
      </button>
    );
  };

export default IngredientItemAdd;
