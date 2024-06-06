"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/SearchBar';
import { FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';

const SearchIngredientPage: React.FC = () => {
  const router = useRouter();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false); // State for showing the modal

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

  const addIngredient = (ingredientToAdd: string) => {
    if (ingredientToAdd.includes("Any")) {
        const anyIngredient = ingredientToAdd.slice(4)
        setSelectedIngredients(prevSelected =>
              {const newList = prevSelected.filter(item => !item.includes(anyIngredient))
            return [...newList, ingredientToAdd]});
    } else {
        setSelectedIngredients(prevSelected =>
            {const newList = prevSelected.filter(item => !(item.includes("Any ") && 
            ingredientToAdd.includes(item.slice(4))))
          return [...newList, ingredientToAdd]});
        // !selectedIngredients.includes(ingredientToAdd)?
        // setSelectedIngredients([...selectedIngredients, ingredientToAdd]) : null
    }
  }

  const handleCheckboxChange = (ingredient: string) => {
    setSelectedIngredients(prevSelected =>
        prevSelected.includes(ingredient)
          ? prevSelected.filter(item => item !== ingredient)
          : [...prevSelected, ingredient]
      );
  };

  const goToIngredientPage = () => {
    router.push({
      pathname: "/ingredients",
      query: { ingredients: selectedIngredients }
    });
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleSearchSubmit = (searchResults: string[]) => {
    searchResults.map(res => addIngredient(res))
    toggleModal();
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col items-center">
        <div className="mb-2 flex justify-center">
          <SearchBar placeholder='White Rice, Soy Sauce' initialIngredients={selectedIngredients}
          onSubmit={handleSearchSubmit} />
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
      <button
            onClick={goToIngredientPage}
            className="relative py-2 px-4 mr-2 rounded-full bg-[#EEF5DB] text-[#3E3F3B]
            hover:bg-[#3E3F3B] hover:text-[#EEF5DB] font-bold border-2 border-[#3E3F3B] flex items-center justify-center"
        >
            <FaShoppingCart/>
            {selectedIngredients.length > 0 &&
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2
                    text-sm bg-red-600 text-white rounded-full px-2">
                    {selectedIngredients.length}
                </span>}
        </button>
        <button onClick={() => router.push({pathname: "/store", query: { ingredients: selectedIngredients }})} 
        className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold">Find Store</button>
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="font-bold text-lg">Selected Ingredients:</h2>
            <ul>
              {selectedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <button onClick={toggleModal} className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchIngredientPage;
