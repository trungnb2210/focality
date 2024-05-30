// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import "../app/globals.css"
import NavBar from '../components/NavBar';
import FindStoreButton from '../components/FindStoreButton';
import IngredientItems from '../components/IngredientItems';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import SearchIngredientPage from './search';

interface IngredientsPageProps {
    ingredients: string[];
  }

// Function to create URL with query parameters based on ingredients array
const createStorePageUrl = (ingredients: string[]) => {
  const baseUrl = "list-of-store-page";
  if (ingredients.length === 0) {
    return baseUrl;
  }
  const queryString = ingredients.map(ingredient => `ingredients=${encodeURIComponent(ingredient)}`).join('&');
  return `${baseUrl}?${queryString}`;
};


const IngredientsPage: React.FC<IngredientsPageProps> = ({  ingredients }) => {
  let findStoreButton = ingredients.length == 0? true: false;

  return (
    <div className="flex flex-col h-screen justify-between]">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col">
        <div className="py-[6px] w-full items-center flex justify-center">
            <IngredientItems ingredients={ingredients}/>
        </div>
      </main>
      <footer className="w-full flex justify-center items-center mb-[25px]">
        <Link
            href={createStorePageUrl(ingredients)}
            className="ml-[16px] mr-[14px]">
            <FindStoreButton d={findStoreButton} />
        </Link>
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
