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
   const originalList = [...ingredients]
   const [ingredientList, setIngredientList] = useState(ingredients.map(i=>[i]));
   //TODO: Change ingredientList into set

   const removeIngredient = (index: number) => {
    setIngredientList((oldList) => oldList.filter((_, idx) => idx !== index));
   };

    const changeIngredientList = (newName: string, index:number) => {
        setIngredientList((oldList) => {
            let newList = [...oldList]
            let curOption = newList[index]

            if (newName !== originalList[index] && !curOption.includes(newName)) {
                curOption = curOption.filter(x=> x!==originalList[index])
                curOption = curOption.concat(newName)

            } else {
                curOption = curOption.includes(newName) ? curOption.filter(x => x !== newName) : curOption.concat([newName])

            }


            if (curOption.length === 0) {
                curOption = [originalList[index]]
            }

            newList[index] = curOption

            return newList

        })
    }

    const preprocessIngredients = (ingredientList: string[]) => {
        let newList = [...ingredientList].map(ingredient =>
                ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient
            );
    
        return newList;
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
                            <DownDownIngredient ingredient={ingredient[0]} index={index} removeMethod={removeIngredient} changeMethod={changeIngredientList} key={index} />
                       ))}
                   </div>
               </div>
           </main>
           <footer className="w-full flex justify-center items-center py-2 fixed bottom-0
           left-0 right-0 bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40">
                <Link
                    href={{
                        pathname: "search",
                        query: { ingredients: ingredientList.flat() }
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
                            query: { ingredients: preprocessIngredients(ingredientList.flat()) }
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