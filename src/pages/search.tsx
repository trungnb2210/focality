"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/SearchBar';
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

const SearchIngredientPage: React.FC = () => {
  const router = useRouter();
  const initialFrequent = ['Prahok', 'Nam Pla', 'Basmati Rice'];
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [frequent, setFrequent] = useState(initialFrequent);
  const [hoverStates, setHoverStates] = useState<boolean[]>([]);

  useEffect(() => {
    const { query } = router;
    if (query.ingredients) {
      const ingredients = Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients];
      setSelectedIngredients(ingredients);
    }
  }, [router.query]);

  const removeIngredient = (index: number) => {
    const ingredient = selectedIngredients[index];
    setSelectedIngredients(prev => prev.filter((_, idx) => idx !== index));
    setHoverStates(prev => prev.filter((_, idx) => idx !== index));
    if (initialFrequent.includes(ingredient)) {
      setFrequent(prev => [ingredient, ...prev]);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [ingredient, ...prev]);
      setHoverStates(prev => [...prev, false]);
      setFrequent(prev => prev.filter(item => item !== ingredient));
    }
  };

  const handleSearchSubmit = (searchResults: string[]) => {
    searchResults.forEach(addIngredient);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col items-center">
        <div className="mb-2 flex justify-center">
          <SearchBar placeholder='White Rice, Soy Sauce' initialIngredients={selectedIngredients} onSubmit={handleSearchSubmit} />
        </div>
        <div className="flex justify-center w-full items-center font-bold pt-5">
          Frequent Picks
        </div>
        <div className="py-6 w-full flex justify-center">
          <div className="flex flex-col items-center space-y-4 w-[343px]">
            {frequent.map((ingredient, index) => (
              <div
                key={ingredient}
                onClick={() => addIngredient(ingredient)}
                className="w-full flex items-center p-3 rounded-lg cursor-pointer bg-[#B8D8D8] text-black drop-shadow-md"
              >
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
        {selectedIngredients.length > 0 && (
          <>
            <div className="flex justify-center w-full items-center font-bold pt-5">
              Cart
            </div>
            <div className="flex flex-col items-center space-y-4 py-6 mb-10">
              {selectedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="relative w-[343px] h-[54px] rounded-lg overflow-hidden drop-shadow-2xl"
                  onMouseEnter={() => setHoverStates(prev => prev.map((state, idx) => idx === index ? true : state))}
                  onMouseLeave={() => setHoverStates(prev => prev.map((state, idx) => idx === index ? false : state))}
                >
                  <button
                    className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367] text-white transition duration-300 ease-in-out"
                    onClick={() => removeIngredient(index)}
                  >
                    <span className="ml-5">{ingredient}</span>
                    <IoClose size={24} className='mr-2'/>
                    {hoverStates[index] && (
                      <div className="absolute inset-0 bg-[#FE5F55] bg-opacity-70 flex items-center justify-center">
                        <span className="text-white font-bold">Remove Item</span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <footer className="w-full flex justify-center items-center fixed bottom-0 left-0 right-0 bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40 py-2">
        <button
          onClick={() => router.push({ pathname: "/ingredients", query: { ingredients: selectedIngredients } })}
          className="relative py-2 px-4 mr-2 rounded-full bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] hover:text-[#EEF5DB] font-bold border-2 border-[#3E3F3B] flex items-center justify-center"
        >
          <FaShoppingCart/>
          {selectedIngredients.length > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-sm bg-red-600 text-white rounded-full px-2">
              {selectedIngredients.length}
            </span>
          )}
        </button>
        <button onClick={() => router.push({ pathname: "/store", query: { ingredients: selectedIngredients } })} className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold">Find Store</button>
      </footer>
    </div>
  );
};

export default SearchIngredientPage;
