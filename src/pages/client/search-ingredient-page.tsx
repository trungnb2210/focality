"use client";

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import Popup from '../../components/Popup';
import IngredientItemsAdd from '@/components/IngredientItemsAdd';

const SearchIngredientPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const frequent = [
    'White Rice',
    'Fish Sauce Nam Pla (Thailand)'
  ];

  const handleEnterPress = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[812px] justify-between">
      <NavBar brandName='Ingredients'/>
      <main className="flex-grow flex flex-col items-center">
        <div className='mb-2'>
            <SearchBar placeholder='White Rice, Soy Sauce' onEnterPress={handleEnterPress} />
        </div>
        <div className=''>
            Frequent Picks
        </div>
        <div className="py-[6px] w-full items-center flex justify-center">
            <IngredientItemsAdd ingredients={frequent}/>
        </div>
      </main>
      <Popup ingredient="Fish Sauce" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SearchIngredientPage;
