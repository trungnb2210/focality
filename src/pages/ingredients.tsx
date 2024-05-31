// pages/client/IngredientsPage.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import "../app/globals.css"
import NavBar from '../components/NavBar';
import FindStoreButton from '../components/FindStoreButton';
import IngredientItems from '../components/IngredientItems';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { GetServerSideProps } from 'next';


interface IngredientsPageProps {
    ingredients: string[];
  }

const IngredientsPage: React.FC<IngredientsPageProps> = ({ingredients = []}) => {
  let findStoreButton = ingredients.length == 0

  return (
    <div className="flex flex-col h-screen justify-between]">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col">
        <div className="py-[6px] w-full items-center flex justify-center">
            <IngredientItems ingredients={ingredients}/>
        </div>
      </main>
      <footer className="w-full flex justify-center items-center mb-[25px]">
        <div className="ml-[16px] mr-[14px]">
            <Link href={{
                pathname: "list-of-store-page",
                query: {
                    ingredients: ingredients
                }
            }}></Link>
            <FindStoreButton d={findStoreButton} ingredientList={ingredients}/>
        </div>
        <Link
            href={{
                pathname: "search",
                query: {
                    ingredients: ingredients
                }
            }}
            className="w-[44px] h-[44px] py-[14px] px-[16px] rounded-[67px]
            bg-[#4F6367] text-white items-center flex justify-center">
            <FaPlus size={24} />
        </Link>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ingredients } = context.query;

  let ingredientArray: string[];
  if (typeof ingredients === 'string') {
    ingredientArray = [ingredients];
  } else if (Array.isArray(ingredients)) {
    ingredientArray = ingredients as string[];
  } else {
    ingredientArray = [];
  }

  return {
    props: {
      ingredients: ingredientArray,
    },
  };
};

export default IngredientsPage;
