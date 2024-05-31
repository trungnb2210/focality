// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

interface IngredientsPageProps {
    ingredients: string[];
}

const IngredientsPage: React.FC<IngredientsPageProps> = ({ ingredients }) => {
    const [ingredientList, setIngredientList] = useState(ingredients);
    const [hoverStates, setHoverStates] = useState<boolean[]>(Array(ingredients.length).fill(false)); // Track hover state for each item

    const removeIngredient = (index: number) => {
        const filteredIngredients = ingredientList.filter((_, idx) => idx !== index); // Remove by index
        setIngredientList(filteredIngredients);
        const newHoverStates = [...hoverStates];
        newHoverStates.splice(index, 1); // Also remove the hover state at the same index
        setHoverStates(newHoverStates);
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
    const notDisableColor = "border-1 border-[#7A9E9F] bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] hover:text-[#EEF5DB]";
    const color = findStoreButton ? disableColor : notDisableColor;

    return (
        <div className="flex flex-col h-screen justify-between">
            <NavBar brandName='Ingredients'/>
            <main className="flex-grow flex flex-col items-center">
                <div className="py-[6px] w-full flex justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        {ingredientList.map((ingredient, index) => (
                            <div
                                key={index}
                                className="relative w-[343px] h-[54px] rounded-lg overflow-hidden"
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                <button
                                    className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367] text-white drop-shadow-lg transition duration-300 ease-in-out"
                                    onClick={() => removeIngredient(index)}
                                >
                                    <span className="ml-5">{ingredient}</span>
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
            <footer className="w-full flex justify-center items-center mb-[25px]">
                <div className="ml-[16px] mr-[14px]">
                    <Link
                        href={{
                            pathname: "list-of-store-page",
                            query: { ingredients: ingredientList }
                        }}
                        className={`${color} rounded-[48px] flex-grow w-[285px] h-[44px] py-[14px] items-center flex justify-center`}
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
