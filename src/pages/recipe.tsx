import React, { useState, useEffect, useRef } from 'react';
import "../app/globals.css"
import NavBar from '@/components/NavBar';
import { FaArrowLeft, FaArrowRight, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import { IoClose } from 'react-icons/io5';

export interface Recipe {
  rid: string;
  name: string;
  nationalities: Nationality[];
  description: string | null;
  timeToCook: number;
  imageUrl: string | null;
  items: string[];
  favouritedByUsers: User[];
}

export interface User {
  uid: string;
  name: string;
  homeSortcode: string;
  nationalities: Nationality[];
  favouriteRecipes: Recipe[];
}

export interface Nationality {
  nid: string;
  name: string;
  users: User[];
  recipes: Recipe[];
}

interface RecipeListProps {
  userName: string;
}

const RecipeList: React.FC<RecipeListProps> = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const [dailySuggestion, setDailySuggestion] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [favScrollLeftDisabled, setFavScrollLeftDisabled] = useState<boolean>(true);
  const [favScrollRightDisabled, setFavScrollRightDisabled] = useState<boolean>(false);
  const [recScrollLeftDisabled, setRecScrollLeftDisabled] = useState<boolean>(true);
  const [recScrollRightDisabled, setRecScrollRightDisabled] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [basket, setBasket] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User>();

  const favRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndRecipes = async () => {
      try {
        const { username, ingredients } = router.query;
        const userName = username ? username as string : "Kevin Nguyen";

        const userResponse = await fetch(`/api/fetch-user?name=${userName}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }
        const user: User = await userResponse.json();
        setUser(user);

        setFavouriteRecipes(user.favouriteRecipes);
        const nationalityNames = user.nationalities.map(nat => nat.name);
        const recipePromises = nationalityNames.map(name =>
          fetch(`/api/fetch-recipe?nationality=${name}`)
            .then(res => res.json())
        );

        const recipesArrays: Nationality[] = await Promise.all(recipePromises);
        const combinedRecipes: Recipe[] = recipesArrays.map(nation => nation.recipes).flat();
        setRecipes(combinedRecipes);

        setDailySuggestion(combinedRecipes[1]);

        if (ingredients) {
          const selectedIngredients = Array.isArray(ingredients) ? ingredients : [ingredients];
          setBasket(new Set(selectedIngredients));
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRecipes();
  }, [router.query]);

  const findIngredientList = (convertingRec: Recipe[] | null) => {
    if (convertingRec != null) {
      return convertingRec.map(r => r.items).flat();
    } else {
      return [];
    }
  }

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth, scrollWidth } = ref.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      let scrollTo = scrollLeft;

      if (direction === 'left') {
        scrollTo = Math.max(scrollLeft - clientWidth, 0);
      } else {
        scrollTo = Math.min(scrollLeft + clientWidth, maxScrollLeft);
      }

      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });

      // Disable buttons based on the new scroll position
      if (ref === favRef) {
        setFavScrollLeftDisabled(scrollTo === 0);
        setFavScrollRightDisabled(scrollTo === maxScrollLeft);
      } else if (ref === recRef) {
        setRecScrollLeftDisabled(scrollTo === 0);
        setRecScrollRightDisabled(scrollTo === maxScrollLeft);
      }
    }
  };

  const addToBasket = (ingredients: string[]) => {
    setBasket(prevBasket => new Set([...Array.from(prevBasket), ...ingredients]));
  };

  const toggleFavourite = async (recipe: Recipe) => {
    try {
      const isFavourite = favouriteRecipes.some(favRecipe => favRecipe.rid === recipe.rid);
      const response = await fetch(`/api/update-favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.uid, recipeId: recipe.rid })
      });
      if (!response.ok) {
        throw new Error('Failed to toggle favourite');
      }
      const updatedFavouriteRecipes = isFavourite
        ? favouriteRecipes.filter(favRecipe => favRecipe.rid !== recipe.rid)
        : [...favouriteRecipes, recipe];
      setFavouriteRecipes(updatedFavouriteRecipes);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="items-center flex flex-col justify-between min-h-screen">
      <NavBar brandName={'Recipes'} />
      {dailySuggestion && (
        <div className="text-center p-4">
          <h1 className="font-semibold text-lg">Daily Suggested Recipe</h1>
          <div
            className="relative rounded-lg shadow-lg overflow-hidden w-full my-4 max-w-md mx-auto cursor-pointer hover:bg-gray-200 transition duration-300"
            onClick={() => setSelectedRecipe(dailySuggestion)}
            ref={recRef}
          >
            <img src={dailySuggestion.imageUrl || 'default-image.jpg'} alt={dailySuggestion.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 p-4 bottom-0 left-0">
              <h3 className="text-white text-xl font-bold">{dailySuggestion.name}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="w-full sm:max-w-5xl max-w-lg mx-auto px-4">
        <h1 className="font-semibold text-lg mb-2">Favourite Recipes</h1>
        <div className="relative">
          <div ref={favRef} className="flex overflow-x-auto space-x-4 p-4 h-60 scrollbar-hide">
            {favouriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.rid} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
            ))}
          </div>
          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 ${favScrollLeftDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => scroll(favRef, 'left')}
            disabled={favScrollLeftDisabled}
          >
            <FaArrowLeft />
          </button>
          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 ${favScrollRightDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => scroll(favRef, 'right')}
            disabled={favScrollRightDisabled}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      <div className="w-full sm:max-w-5xl max-w-lg mx-auto px-4 mt-4">
        <h1 className="font-semibold text-lg mb-2">Recommended Recipes</h1>
        <div className="relative">
          <div ref={recRef} className="flex overflow-x-auto space-x-4 p-4 h-60 scrollbar-hide">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.rid} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
            ))}
          </div>
          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 ${recScrollLeftDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => scroll(recRef, 'left')}
            disabled={recScrollLeftDisabled}
          >
            <FaArrowLeft />
          </button>
          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 ${recScrollRightDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => scroll(recRef, 'right')}
            disabled={recScrollRightDisabled}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToBasket={addToBasket}
          onToggleFavourite={toggleFavourite}
          isFavourite={favouriteRecipes.some(favRecipe => favRecipe.rid === selectedRecipe.rid)}
        />
      )}
      <div className="h-10"></div>
      <footer className="w-full flex justify-center items-center fixed bottom-0 left-0 right-0 
      bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40 py-2">
        <Link
          className="relative py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold"
          href={{
            pathname: "/search",
            query: {
              ingredients: Array.from(basket),
              address: user?.homeSortcode
            }
          }}
        >
          See Ingredients
          {basket.size > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-sm bg-red-600 text-white rounded-full px-2">
              {basket.size}
            </span>
          )}
        </Link>
      </footer>
    </div>
  );
}

const RecipeCard: React.FC<{ recipe: Recipe; onClick: () => void }> = ({ recipe, onClick }) => (
  <div className="relative rounded-lg shadow-lg overflow-hidden sm:w-80 w-60 flex-shrink-0 cursor-pointer" onClick={onClick}>
    <img src={recipe.imageUrl || 'default-image.jpg'} alt={recipe.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
      <h3 className="text-white text-xl font-bold">{recipe.name}</h3>
    </div>
  </div>
);

const RecipeModal: React.FC<{ recipe: Recipe; onClose: () => void; onAddToBasket: (ingredients: string[]) => void; onToggleFavourite: (recipe: Recipe) => void; isFavourite: boolean }> = ({ recipe, onClose, onAddToBasket, onToggleFavourite, isFavourite }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(recipe.items);
  const [allSelected, setAllSelected] = useState<boolean>(true);

  const handleItemChange = (item: string) => {
    if (selectedItems.includes(item)) {
      setAllSelected(false);
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(recipe.items);
    }
    setAllSelected(!allSelected);
  };

  const handleDone = () => {
    onAddToBasket(selectedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="my-auto bg-white rounded-lg max-w-md w-full overflow-auto overscroll-contain">
        <div className="relative">
          <img src={recipe.imageUrl || 'default-image.jpg'} alt={recipe.name} className="w-full h-64 object-cover" />
          <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2" onClick={onClose}>
            <IoClose size={20} />
          </button>
          <button className="absolute top-2 left-2 bg-white text-red-500 rounded-full p-2" onClick={() => onToggleFavourite(recipe)}>
            {isFavourite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
          <p className="text-sm mb-4">{recipe.description}</p>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Select All
            </label>
          </div>
          <ul className="list-disc list-inside mb-4">
            {recipe.items ? recipe.items.map((item, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleItemChange(item)}
                  className="mr-2"
                />
                <span className="text-sm">{item}</span>
              </li>
            )) : []}
          </ul>
          <button
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            onClick={handleDone}
          >
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
