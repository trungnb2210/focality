// pages/client/IngredientsPage.tsx
"use client";

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import FindStoreButton from '../../components/FindStoreButton';
import IngredientItems from '../../components/IngredientItems';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import SearchIngredientPage from './search-ingredient-page';
import StoreItem from '@/components/StoreItem';

interface IngredientsPageProps {
    ingredients: string[];
  }

const IngredientsPage: React.FC<IngredientsPageProps> = ({  ingredients }) => {
  let findStoreButton = ingredients.length == 0? true: false;

  return (
    <div className="flex flex-col h-[812px] justify-between">
        
    </div>
  );
};

export default IngredientsPage;
