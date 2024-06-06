import React, { useState, useCallback } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from 'next/router';
import { Item } from '@/pages/api/ingredients';

interface searchBarProp {
    placeholder: string;
    initialIngredients: string[];
}

export const SearchBar: React.FC<searchBarProp> = ({ placeholder, initialIngredients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // Controls dropdown visibility
  const [suggestions, setSuggestions] = useState<string[]>([]); 
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

  const fetchSuggestions = async (searchValue: string) => {
    if (searchValue.length > 1) {
      const matches = await queryDatabase(searchValue);
      const items: Item[] = Array.isArray(matches) ? matches : [matches];
      const itemsShown = 5;
      const formattedItems = items.map(item => 
        item.nativeName 
          ? item.nativeName + ' (' + item.name + ')'
          : item.name
      ).slice(0, itemsShown);
      setSuggestions(formattedItems);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Used to delay constant queries while user is typing
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Can change delay after typing before suggestions appear
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 200), []); 

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    debouncedFetchSuggestions(searchValue)
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    
    router.push({
      pathname: '/ingredients',
      query: { ingredients: initialIngredients.concat([suggestion]) }
    });
  };

  return (
    <div className="relative">
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
    {showSuggestions && (
      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg mt-1 text-[#64748B]">
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(item)}
            className="py-1 px-3 cursor-pointer hover:bg-gray-100"
          >
            {item}
          </li>
        ))}
      </ul>
    )}
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


export const queryDatabase = async (ingredient: string) => {
  //need to try catch?
  const response = await fetch(`/api/ingredients?ingredient=${encodeURIComponent(ingredient)}`);
  // console.log(response)
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
