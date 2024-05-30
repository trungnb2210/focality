
"use client"

import React, { useState } from 'react';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import Popup from '@/components/Popup';
import { FaPlus } from "react-icons/fa";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// import { useIngredientsContext, IngredientsProvider } from '@/contexts/IngredienstsContext';

interface SearchIngredientProp {
    fml: string[];
}

const SearchIngredientPage: React.FC<SearchIngredientProp> = ({fml}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const { addIngredient } = useIngredientsContext();
  const router = useRouter();

  console.log(usePathname())

  const frequent = [
    'White Rice',
    'Fish Sauce Nam Pla (Thailand)'
  ];

  const handleEnterPress = () => {
    setIsModalOpen(true);
  };

  const handleGoToList = (newIngredient: string) => {
    router.push('/client/ingredient-list-page');
  };
  const addItem = (newIngredient: string) => {
    return [...[], newIngredient];
  }

  return (
    <div className="flex flex-col h-screen justify-between">
        <NavBar brandName='Ingredients' />
        <main className="flex-grow flex flex-col">
            <div className="mb-2 flex justify-center">
            <SearchBar placeholder='White Rice, Soy Sauce' onEnterPress={handleEnterPress} />
            </div>
            <div className="flex justify-center w-[343px] items-center font-bold py-2">
            <div>
                Frequent Picks
            </div>
            </div>
            <div className="py-[6px] w-full items-center flex justify-center">
            <div className="flex flex-col items-center space-y-4">
                {frequent.map((ingredient, index) => (
                <Link
                    key={index}
                    href={{
                        pathname: "ingredients",
                        query: {
                            ingredient: ["white Rice"]
                        }
                    }}
                    className="flex justify-between items-center w-[343px] h-[54px] bg-[#4F6367]
                    rounded-[14px] text-white">
                    <span className="w-full ml-5">{ingredient}</span>
                    <div className="mr-[14px]">
                    <FaPlus size={24} />
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </main>
        <Popup ingredient="Fish Sauce" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SearchIngredientPage;
