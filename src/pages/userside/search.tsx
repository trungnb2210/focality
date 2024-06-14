"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "@/app/globals.css";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/SearchBar';
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const SearchIngredientPage: React.FC = () => {
  const router = useRouter();
  const initialFrequent = ['Prahok', 'Nam Pla', 'Basmati Rice'];
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [frequent, setFrequent] = useState<string[]>([]);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const { query } = router;
    if (query.ingredients) {
      const ingredients = Array.isArray(query.ingredients) ? query.ingredients : [query.ingredients];
      setSelectedIngredients(ingredients);
      const newFreq = initialFrequent.filter(i => !ingredients.includes(i));
      setFrequent(newFreq);
      if (query.address) {
        const addr = query.address as string;
        setAddress(addr);
      }
    } else {
      setFrequent(initialFrequent);
    }
  }, [router.query]);

  const preprocessIngredients = (ingredientList: string[]) => {
    let newList = [...ingredientList].map(ingredient =>
      ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient
    );

    return newList;
  };

  const removeIngredient = (index: number) => {
    const ingredient = selectedIngredients[index];
    setSelectedIngredients(prev => prev.filter((_, idx) => idx !== index));
    if (initialFrequent.includes(ingredient)) {
      setFrequent(prev => [ingredient, ...prev]);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [ingredient, ...prev]);
      setFrequent(prev => prev.filter(item => item !== ingredient));
    }
  };

  const changeIngredientList = (newName: string, index:number) => {
    setSelectedIngredients((oldList) => {
      let newList = [...oldList];
      newList[index] = newName;
      return newList;
    });
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
          <div className="items-center grid grid-cols-1 divide-y">
            {frequent.map((ingredient, index) => (
              <div
                key={ingredient}
                onClick={() => {addIngredient(ingredient)}}
                className="flex justify-between items-center h-[54px] w-[343px] "
              >
                <span>{ingredient}</span>
                <FaPlus/>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center w-full items-center font-bold pt-5">
            Cart
            <div
            className="relative mr-2 px-2 text-[#3E3F3B] font-bold flex items-center justify-center"
            >
            <FaShoppingCart/>
            {selectedIngredients.length > 0 && (
                <span className="">
                    <span>(</span> {selectedIngredients.length} <span>)</span>
                </span>
            )}
            </div>
        </div>
        {selectedIngredients.length > 0 && (
          <>
            <div className="items-center grid grid-cols-1 divide-y">
              {selectedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center h-[54px] w-[343px] "
                >
                    <span className="flex justify-center items-center rounded-lg">{ingredient}</span>
                    <button className="items-center bg-slate-300 rounded-full h-1/2 py-1 px-3"
                      onClick={() => removeIngredient(index)} >
                        <FaTrash/>
                    </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <footer className="w-full flex justify-center items-center fixed bottom-0 left-0 right-0 bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40 py-2">
        <button onClick={() =>
            router.push({
                pathname: "/userside/recipe",
                query: {
                    ingredients: preprocessIngredients(selectedIngredients)
                } })}
          className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold mx-2">Find Recipes</button>
        <button onClick={() => 
            router.push({ 
                pathname: "/userside/store",
                query: { 
                    ingredients: preprocessIngredients(selectedIngredients),
                    address: address ? address : ""
                } })}
            className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold mx-2">Find Store</button>
      </footer>
    </div>
  );
};

export default SearchIngredientPage;
