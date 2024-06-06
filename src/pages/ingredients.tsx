// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { IoClose } from "react-icons/io5";

interface IngredientsPageProps {
   ingredients: string[];
}

const IngredientsPage: React.FC<IngredientsPageProps> = ({ ingredients }) => {
   const [ingredientList, setIngredientList] = useState(ingredients);
   const [hoverStates, setHoverStates] = useState<boolean[]>(Array(ingredients.length).fill(false));

   const removeIngredient = (index: number) => {
       const filteredIngredients = ingredientList.filter((_, idx) => idx !== index);
       setIngredientList(filteredIngredients);
       const newHoverStates = [...hoverStates];
       newHoverStates.splice(index, 1);
       setHoverStates(newHoverStates);
   };

   const preprocessIngredients = (ingredientList: string[]) => {
    return ingredientList.map(ingredient =>
            ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient
        );
   };

   const handleMouseEnter = (index: number) => {
       const newHoverStates = hoverStates.map((state, idx) => idx === index ? true : state);
       setHoverStates(newHoverStates);
   };

   const handleMouseLeave = (index: number) => {
       const newHoverStates = hoverStates.map((state, idx) => idx === index ? false : state);
       setHoverStates(newHoverStates);
   };

   const findStoreButton = ingredientList.length === 0;
   const disableColor = "bg-[#E3E5E5] text-[#979C9E]";
   const notDisableColor = "border-1 border-[#7A9E9F] bg-[#3E3F3B] text-[#EEF5DB] hover:bg-[#7A9E9F] hover:text-[#3E3F3B]";
   const color = findStoreButton ? disableColor : notDisableColor;
   const pointerEvents = findStoreButton ? "pointer-events-none" : "";

   return (
       <div className="flex flex-col h-screen justify-between">
           <NavBar brandName='Ingredients'/>
           <main className="flex-grow flex flex-col items-center mb-6">
                <div className="py-[6px] w-full flex justify-center">
                   <div className="flex flex-col items-center space-y-4">
                       {ingredientList.map((ingredient, index) => (
                           <div
                               key={index}
                               className="relative w-[343px] h-[54px] rounded-lg overflow-hidden drop-shadow-2xl"
                               onMouseEnter={() => handleMouseEnter(index)}
                               onMouseLeave={() => handleMouseLeave(index)}
                           >
                               <button
                                   className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367] text-white  transition duration-300 ease-in-out"
                                   onClick={() => removeIngredient(index)}
                               >
                                   <span className="ml-5">{ingredient}</span>
                                   <IoClose size={24} className='mr-2'/>
                                   {hoverStates[index] &&
                                       (<div className="absolute inset-0 bg-[#FE5F55] bg-opacity-70 flex items-center justify-center">
                                           <span className="text-white font-bold">Remove Item</span>
                                       </div>)
                                   }
                               </button>
                           </div>
                       ))}
                   </div>
               </div>
           </main>
           <footer className="w-full flex justify-center items-center py-2 fixed bottom-0
           left-0 right-0 bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40">
                <Link
                    href={{
                        pathname: "search",
                        query: { ingredients: ingredientList }
                    }}
                    className="p-2 rounded-[67px] bg-red-600
                    text-white items-center flex justify-center hover:bg-red-300 hover:text-white
                    drop-shadow-2xl"
                >
                    <FaPlus size={20} />
                </Link>
                <div className="ml-2 mr-[14px]">
                    <Link
                        href={{
                            pathname: "store",
                            query: { ingredients: preprocessIngredients(ingredientList) }
                        }}
                        className={`py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold
                        drop-shadow-2xl`}
                    >
                        Find Store
                    </Link>
                </div>
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