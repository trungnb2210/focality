"use client";

import React from 'react';
import IngredientItem from './IngredientItem';

interface IngredientItemsProps {
  ingredients: string[];
}

const IngredientItems: React.FC<IngredientItemsProps> = ({ ingredients }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {ingredients.map((ingredient, index) => (
        <IngredientItem key={index} label={ingredient} onRemove={function (): void {
              throw new Error('Function not implemented.');
          } } />
      ))}
    </div>
  );
};

export default IngredientItems;
