// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { IoClose } from "react-icons/io5";
import DownDownIngredient from '@/components/IngredientBox';

interface IngredientsPageProps {
   ingredients: string[];
}

const IngredientsPage: React.FC<IngredientsPageProps> = ({ ingredients }) => {
   const [ingredientList, setIngredientList] = useState(ingredients);
   //TODO: Change ingredientList into set

   const removeIngredient = (index: number) => {
       const filteredIngredients = ingredientList.filter((_, idx) => idx !== index);
       setIngredientList(filteredIngredients);
   };

    const changeIngredientList = (newName: string, index:number) => {
        console.log(ingredientList)
        let newList = ingredientList
        newList[index] = newName
        setIngredientList(newList)
        console.log(ingredientList)
    }

   const preprocessIngredients = (ingredientList: string[]) => {
    return ingredientList.map(ingredient =>
            ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient
        );
   };

   const findStoreButton = ingredientList.length === 0;
   const disableColor = "bg-[#E3E5E5] text-[#979C9E]";
   const notDisableColor = "border-1 border-[#7A9E9F] bg-[#3E3F3B] text-[#EEF5DB] hover:bg-[#7A9E9F] hover:text-[#3E3F3B]";
   const color = findStoreButton ? disableColor : notDisableColor;
   const pointerEvents = findStoreButton ? "pointer-events-none" : "";

   return (
       <div className="flex flex-col h-screen justify-between">
           <NavBar brandName='Ingredients'/>
           <main className="flex-grow flex flex-col items-center">
                <div className="py-[6px] w-full flex justify-center">
                   <div className="flex flex-col items-center space-y-4">
                       {ingredientList.map((ingredient, index) => (
                            <DownDownIngredient ingredient={ingredient} index={index} removeMethod={removeIngredient} changeMethod={changeIngredientList} key={index} />
                       ))}
                   </div>
               </div>
           </main>
           <footer className="w-full flex justify-center items-center mb-[25px]">
               <div className="ml-[16px] mr-[14px]">
                   <Link
                       href={{
                           pathname: "location",
                           query: { ingredients: preprocessIngredients(ingredientList) }
                       }}
                       className={`${color} ${pointerEvents} rounded-[48px] flex-grow w-[285px] h-[44px] py-[14px] items-center flex justify-center`}
                   >
                       Find Store
                   </Link>
               </div>
               <Link
                   href={{
                       pathname: "search",
                       query: { ingredients: ingredientList }
                   }}
                   className="w-[44px] h-[44px] py-[14px] px-[16px] rounded-[67px] bg-[#4F6367] text-white items-center flex justify-center hover:bg-[#B8D8D8] hover:text-white"
               >
                   <FaPlus size={24} />
               </Link>
           </footer>
       </div>
   );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
   const { ingredients } = context.query;

   let ingredientArray: string[] = [];
   if (typeof ingredients === 'string') {
       ingredientArray = [ingredients];
   } else if (Array.isArray(ingredients)) {
       ingredientArray = ingredients;
   }

   return {
       props: {
           ingredients: ingredientArray,
       },
   };
};

export default IngredientsPage;