// pages/client/SearchIngredientPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import  {SearchBar } from '@/components/SearchBar';
import Popup from '@/components/Popup';
import Link from 'next/link';


const SearchIngredientPage: React.FC = () => {
 const router = useRouter();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

 useEffect(() => {
   const { query } = router;
   if (query.ingredients) {
     const ingredients = Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients];
     setSelectedIngredients(ingredients);
   }
 }, [router.query]);

 const frequent = [
   'Prahok',
   'Nam Pla',
   'Basmati Rice',
   'Jasmine Rice',
   'Nuoc Mam',
 ];

 const handleCheckboxChange = (ingredient: string) => {
   setSelectedIngredients(prevSelected =>
     prevSelected.includes(ingredient)
       ? prevSelected.filter(item => item !== ingredient)
       : [...prevSelected, ingredient]
   );
 };

 return (
   <div className="flex flex-col h-screen justify-between">
     <NavBar brandName='Ingredients'/>
     <main className="flex-grow flex flex-col items-center">
       <div className="mb-2 flex justify-center">
         <SearchBar placeholder='White Rice, Soy Sauce' initialIngredients={selectedIngredients}/>
       </div>
       <div className="flex justify-center w-full items-center font-bold pt-5">
         Frequent Picks
       </div>
       <div className="py-6 w-full flex justify-center">
         <div className="flex flex-col items-center space-y-4 w-[343px]">
           {frequent.map((ingredient, index) => (
             <div
               key={index}
               onClick={() => handleCheckboxChange(ingredient)}
               className={`w-full flex items-center p-3 rounded-lg cursor-pointer ${
                 selectedIngredients.includes(ingredient) ? 'bg-[#4F6367] text-white' : 'bg-[#B8D8D8] text-black'
               } drop-shadow-md`}
             >
               <span>{ingredient}</span>
             </div>
           ))}
         </div>
       </div>
     </main>
     <footer className="w-full flex justify-center items-center mb-4">
       <Link
         href={{
           pathname: "/ingredients",
           query: { ingredients: selectedIngredients }
         }}
         className="py-2 px-4 rounded-full bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B]
         hover:text-[#EEF5DB] focus:outline-none focus:ring-2 focus:ring-blue-500
         focus:ring-opacity-50 font-bold"
       >
         Confirm
       </Link>
     </footer>
     <Popup ingredient="Fish Sauce" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
   </div>
 );
};

export default SearchIngredientPage;