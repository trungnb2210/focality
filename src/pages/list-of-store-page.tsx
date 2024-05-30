"use client";

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import FindStoreButton from '../components/FindStoreButton';
import IngredientItems from '../components/IngredientItems';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import SearchIngredientPage from './search';

interface IngredientsPageProps {
    ingredients: string[];
  }

const ListOfStorePage: React.FC<IngredientsPageProps> = ({  ingredients }) => {

  return (
    <div className="flex flex-col h-[812px] justify-between">
      
    </div>
  );
};

export default ListOfStorePage;
