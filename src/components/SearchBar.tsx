import React, { useState, useCallback } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { Item } from '@/pages/api/ingredients';

interface searchBarProp {
  placeholder: string;
  initialIngredients: string[];
  onSubmit: (ingredients: string[]) => void;
}

export const SearchBar: React.FC<searchBarProp> = ({ placeholder, initialIngredients, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setShowSuggestions(false);
    const ingredientNames = parseIngredients(searchTerm);

    try {
      const formattedIngredients = await findSimilarIngredients(ingredientNames);
      onSubmit(formattedIngredients)
    } catch (error) {
      console.error('Failed to query ingredients:', error);
    }
  };

  const fetchSuggestions = async (searchValue: string) => {
    if (searchValue.length > 1) {
      const ingredients = parseIngredients(searchValue);
      const itemsSet = new Set<string>();

      for (const ingredient of ingredients) {
        const matches = await queryDatabase(ingredient);
        const matchesArray: Item[] = Array.isArray(matches) ? matches : [matches];
        const formattedItems = matchesArray.map(item => 
          item.nativeName 
            ? item.nativeName
            : item.name)
        
        formattedItems.forEach(item => itemsSet.add(item));
      }
      if (itemsSet.size > 0) {
        setSuggestions(Array.from(itemsSet));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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
    setSelectedSuggestions(prev =>
      prev.includes(suggestion) ? prev.filter(item => item !== suggestion) : [...prev, suggestion]
    );
  };

  const handleConfirmSelection = () => {
    setShowSuggestions(false);
    onSubmit(selectedSuggestions);
    setSelectedSuggestions([]);
  };

  const handleFocus = () => {
    if (searchTerm.length > 1) {
      setShowSuggestions(true);
    }
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
        onFocus={handleFocus}
        className="bg-[#F8FAFC] outline-none flex-grow text-[#64748B] ml-[8px]"
      />
    </div>
    {showSuggestions && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg mt-1 text-[#64748B]">
          <div className="max-h-60 overflow-y-auto">
            <ul>
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className={`py-1 px-3 cursor-pointer flex items-center ${selectedSuggestions.includes(item) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleConfirmSelection} className="py-1 px-3 cursor-pointer rounded-b-lg bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black w-full">
            Confirm Selection
          </button>
        </div>
      )}
    </div>

  );
};

const parseIngredients = (input: string) => {
  const unwantedChars = /["“”:]/g;
  const notesPattern = /\([^)]*\)/g;
  const numbersPattern = /[0-9/\.]+/g;
  const unitsPattern = /\b(?:cm|oz|tsp|tbsp|tbs|cup|cups|ml|l|kg|g|pound|cloves|slice|slices|oz|stalks|inch|inches|piece|pieces|bunch|bunches|ounces|tablespoons|minced)\b/gi;
  const descriptors = /\b(?:of|peeled|deveined|crushed|chopped|sliced|cut|diced|torn|low|high|sodium|fresh|roughly|into|optional|to|plus|half|cooked|uncooked|g|serve|thinly|in|lengthwise)\b/gi;

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
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const findSimilarIngredients = async (ingredientArray: string[]) => {
  const result: string[] = []
  for (const ingredient of ingredientArray) {
    const matches = await queryDatabase(ingredient);
    if (matches.length > 1) {
        const titleCasedIngredient = toTitleCase(ingredient);
        result.push("Any " + titleCasedIngredient);
    } else {
        const titleCasedIngredient = toTitleCase(ingredient);
        result.push(titleCasedIngredient);
    }
  }
  return result;
}

const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
