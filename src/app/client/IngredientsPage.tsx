// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import NavBar from './Component/NavBar';
import SearchBar from './Component/SearchBar';
import IngredientItemAdd from "./Component/IngredientItemAdd"
import FindStoreButton from './Component/FindStoreButton';
import AddButton from './Component/AddButton'
import IngredientItem from './Component/IngredientItem';
import Popup from './Component/Popup';
import IngredientItems from './Component/IngredientItems';


const IngredientsPage: React.FC = () => {
  const ingredients = [
    'Pork Belly',
    'Pork Shoulder',
    'Rico Coconut Soda',
    'Fish sauce - Nước Mắm (Vietnam)',
    'Salt',
    'Caramel Color (nuoc mau)',
    'Eggs',
    'Yellow Onion',
  ];
  let findStoreButton = ingredients.length == 0? true: false;

  return (
    <div className="flex flex-col h-[812px] justify-between">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col items-center">
        <div className="py-[6px] w-full items-center flex justify-center">
            <IngredientItems ingredients={ingredients}/>
        </div>
      </main>
      <footer className="w-full flex items-center mb-[25px]">
        <div className="ml-[16px] mr-[14px]">
            <FindStoreButton d={findStoreButton} />
        </div>
        <AddButton/>
      </footer>
    </div>
  );
};

export default IngredientsPage;
