// pages/client/SearchIngredientPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import Popup from '@/components/Popup';
import { FaPlus } from "react-icons/fa";
import Link from 'next/link';

interface SearchIngredientProp {
    fml: string[];
}

const SearchIngredientPage: React.FC<SearchIngredientProp> = ({ fml }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const { query } = router;
    if (query.ingredients) {
      const ingredients = Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients];
      setSelectedIngredients(ingredients);
    }
  }, [router]);

  const frequent = [
    'Prahok',
    'Fish Sauce Nam Pla (Thailand)',
    'Basmati Rice',
    'Jasmine Rice',
    'Fish Sauce Nuoc Mam (Vietnam)',
  ];

  const handleEnterPress = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (ingredient: string) => {
    setSelectedIngredients(prevSelected =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter(item => item !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar brandName='Ingredients' />
      <main className="flex-grow flex flex-col items-center">
        <div className="mb-2 flex justify-center">
          <SearchBar placeholder='White Rice, Soy Sauce' onEnterPress={handleEnterPress} />
        </div>
        <div className="flex justify-center w-[343px] items-center font-bold py-2">
          Frequent Picks
        </div>
        <div className="py-[6px] w-full items-center flex justify-center">
          <div className="flex flex-col items-center space-y-4">
            {frequent.map((ingredient, index) => (
              <div key={index} className="flex items-center w-[343px]">
                <input
                  type="checkbox"
                  id={`ingredient-${index}`}
                  checked={selectedIngredients.includes(ingredient)}
                  onChange={() => handleCheckboxChange(ingredient)}
                  className="mr-2"
                />
                <label htmlFor={`ingredient-${index}`} className="flex-grow flex justify-between items-center h-[54px] bg-[#4F6367] rounded-[14px] text-white px-5">
                  <span>{ingredient}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="w-auto flex justify-center items-center mb-[25px]">
        <Link
          href={{
            pathname: "/ingredients",
            query: { ingredients: selectedIngredients }
          }}
          className="py-[14px] px-[16px] rounded-[67px] bg-[#4F6367] text-white items-center flex justify-center"
        >
        Confirm
        </Link>
      </footer>
      <Popup ingredient="Fish Sauce" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SearchIngredientPage;
