import React, { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from 'next/router';
import { Item } from '@/pages/api/ingredients';

interface searchBarProp {
    placeholder: string;
    initialIngredients: string[];
}

export const SearchBar: React.FC<searchBarProp> = ({ placeholder, initialIngredients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const ingredientNames = parseIngredients(searchTerm);
    console.log('Parsed Ingredients:', ingredientNames);

    try {
        const formattedIngredients = await findSimilarIngredients(ingredientNames);
        router.push({
          pathname: '/ingredients',
          query: { ingredients: initialIngredients.concat(formattedIngredients) }
        });
      } catch (error) {
        console.error('Failed to query ingredients:', error);
      }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center bg-[#F8FAFC] px-[16px] py-[8px] border-[1px] rounded-[8px] w-full">
      <IoSearchOutline color='grey'/>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="bg-[#F8FAFC] outline-none flex-grow text-[#64748B] ml-[8px]"
      />
    </div>
  );
};

const parseIngredients = (input: string) => {
  const unwantedChars = /["“”:]/g;
  const notesPattern = /\([^)]*\)/g;
  const numbersPattern = /[0-9/\.]+/g;
  const unitsPattern = /\b(?:cm|oz|tsp|tbsp|tbs|cup|cups|ml|l|kg|g|pound|cloves|slice|slices|oz|stalks|inch|inches|piece|pieces|bunch|bunches|ounces|tablespoons|minced)\b/gi;
  const descriptors = /\b(?:peeled|deveined|crushed|chopped|sliced|cut|diced|torn|low|high|sodium|fresh|roughly|into|optional|to|plus|half|cooked|uncooked|g|serve|thinly|in|lengthwise)\b/gi;

  return input
    .replace(unwantedChars, '')
    .replace(numbersPattern, '')
    .replace(unitsPattern, '')
    .replace(notesPattern, '')
    .replace(descriptors, '')
    .split(/[\u25A1,▢]+|\s{2,}/)
    .flatMap(ingredient => ingredient.split(/\s+or\s+/))
    .map(ingredient => ingredient.trim())
    .filter(Boolean)
    .filter(ingredient => ingredient.length > 1);
};


const queryDatabase = async (ingredient: string) => {
  const response = await fetch(`/api/ingredients?ingredient=${encodeURIComponent(ingredient)}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const findSimilarIngredients = async (ingredientArray: string[]) => {
  const result: string[] = []
  for (const ingredient of ingredientArray) {
    const matches = await queryDatabase(ingredient);
    console.log(matches)
    if (matches.length > 1) {
        const titleCasedIngredient = toTitleCase(ingredient);
        result.push("Any " + titleCasedIngredient);
    } else if (matches.length == 1) {
        const titleCasedIngredient = toTitleCase(ingredient);
        result.push(titleCasedIngredient);
    } else {
        alert(`${ingredient} not found in database`)
    }
  }
  return result;
}

const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
