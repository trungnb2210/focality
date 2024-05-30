// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import FindStoreButton from '../components/FindStoreButton';
import IngredientItems from '../components/IngredientItems';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import SearchIngredientPage from './search';

interface IngredientsPageProps {
    ingredients: string[];
  }

const IngredientsPage: React.FC<IngredientsPageProps> = ({  ingredients }) => {
  let findStoreButton = ingredients.length == 0? true: false;

  return (
    <div className="flex flex-col h-[812px] justify-between">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col items-center">
        <div className="py-[6px] w-full items-center flex justify-center">
            <IngredientItems ingredients={ingredients}/>
        </div>
      </main>
      <footer className="w-full flex items-center mb-[25px]">
        <div className="ml-[16px] mr-[14px]">
            <FindStoreButton d={findStoreButton} />
        </div>
        <Link
            href={"search"}
            className="w-[44px] h-[44px] py-[14px] px-[16px] rounded-[67px] 
            bg-[#4F6367] text-white items-center flex justify-center">
            <FaPlus size={24} />
        </Link>
      </footer>
    </div>
  );
};

export default IngredientsPage;
