import React, { useRef, useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Loader } from '@googlemaps/js-api-loader';
import { GetServerSideProps } from 'next';
import "@/app/globals.css";
import NavBar from '@/components/NavBar';
import ItemComponent from '@/components/storeItem';
import LocationInput from '@/components/LocationInput';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

const libraries: Loader["libraries"] = ["places"];

export interface Item {
    iid: string;
    name: string;
    nativeName: string;
    price: number;
    imageUrl: string;
    description: string;
    storeId: string;
    store: Store;
}

export interface Store {
    sid: string;
    name: string | null;
    sortcode: string;
    imageUrl: string;
    items: Item[];
    email: string | null;
    phoneNo: string | null;
    availableItems: string[];
    unavailableItems: string[];
    distance: number;
    matchedIngredients: number;
}

interface ListOfStorePageProps {
    initialStores: Store[];
    ingredients: string[];
    searchAddress: string | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients, address } = context.query;
    const ingredientsArray = ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : [];
    const searchAddress = Array.isArray(address) ? address[0] : address; 

    // Fetch the initial list of stores
    const ingredientsParam = encodeURIComponent(JSON.stringify(ingredientsArray));
    const locationParam = encodeURIComponent(searchAddress || "");
    const response = await fetch(`https://focality-jack-nguyens-projects-ea05a78b.vercel.app/api/distance?ingredients=${ingredientsParam}&currentLocation=${locationParam}`);
    const data = await response.json();

    return {
        props: {
            initialStores: data.stores || [],
            ingredients: ingredientsArray,
            searchAddress: searchAddress
        },
    };
}

const ListOfStorePage: React.FC<ListOfStorePageProps> = ({ initialStores, ingredients, searchAddress }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAZQITL5AWcrnNWaeh_zQpllcI-5fPGmC4",
        libraries,
    });

    const router = useRouter();

    const [stores, setStores] = useState<Store[]>(initialStores);
    const [currentLocation, setCurrentLocation] = useState<string>(searchAddress || "");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filterMustHaveIngredients, setFilterMustHaveIngredients] = useState<string[]>([]);
    const [sortCriteria, setSortCriteria] = useState('matchedIngredients');

    const fetchStores = async (location: string) => {
        const ingredientsParam = encodeURIComponent(JSON.stringify(ingredients));
        const locationParam = encodeURIComponent(location);
        const response = await fetch(`../api/distance?ingredients=${ingredientsParam}&currentLocation=${locationParam}`);
        const data = await response.json();
        setStores(data.stores);
        setCurrentLocation(location);
    };

    const handleLocationSelect = (location: string) => {
        fetchStores(location);
    };

    const sortedStores = stores.sort((a, b) => {
        if (sortCriteria === 'distance') {
            return a.distance - b.distance;
        }
        return b.matchedIngredients - a.matchedIngredients;
    });

    const handleIngredientToggle = (ingredient: string) => {
        setFilterMustHaveIngredients(prev =>
            prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
        );
    };

    const handleFilterApply = () => {
        const filteredStores = stores.filter(store =>
            filterMustHaveIngredients.every(ingredient =>
                store.items.some(item =>
                    item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                    (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                )
            )
        );
        setStores(filteredStores);
        setShowFilterModal(false);
    };

    // Poll for updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStores(currentLocation);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentLocation]);

    if (!isLoaded) return <CircularProgress />;

    return (
        <div className="flex flex-col h-screen">
            <NavBar brandName='Stores List' />
            <div className="p-4 drop-shadow-sm ">
                <div className="flex">
                    <LocationInput onLocationSelect={handleLocationSelect} initialAddress={currentLocation} />
                </div>
                <div className="flex-shrink-0 flex items-center">
                    <select
                        value={sortCriteria}
                        onChange={(e) => setSortCriteria(e.target.value)}
                        className="content-fit p-2 inline rounded-2xl drop-shadow-sm bg-[#B8D8D8] 
                        mx-2 font-semibold text-gray-700"
                    >
                        <option value="matchedIngredients">Sort by Available Ingredient</option>
                        <option value="distance">Sort by Distance</option>
                    </select>
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className={`py-2 px-4 rounded-full font-bold mx-2 ${filterMustHaveIngredients.length > 0 ? 'bg-red-600 text-white' : 'bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black'}`}
                    >
                        Filter
                    </button>
                </div>
            </div>
            <main className="flex-grow flex flex-col justify-start px-4 py-6 mb-12">
                <div className="w-full flex flex-col items-center">
                    {sortedStores.map((store) => (
                        <ItemComponent key={store.sid} store={store} ingredients={ingredients} distance={store.distance} />
                    ))}
                    {sortedStores.length === 0 && (
                        <p className="text-center text-gray-600 mt-8">No stores found for the given ingredients.</p>
                    )}
                </div>
                <div className="mb-12"></div>
            </main>
            <footer className="w-full flex justify-center items-center py-2 fixed bottom-0
           left-0 right-0 bg-white drop-shadow-4xl backdrop-filter backdrop-blur-lg bg-opacity-40">
                <button
                    onClick={() =>
                        router.push({
                            pathname: "/userside/search",
                            query: {
                                ingredients: ingredients,
                                address: currentLocation
                            }
                        })}
                    className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold mx-2"
                >
                    <span>View cart</span>
                    {ingredients.length > 0 && (
                        <span className="">
                            <span> (</span> {ingredients.length} <span>)</span>
                        </span>
                    )}
                </button>
            </footer>
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-4">
                        <h2 className="text-xl font-bold mb-4">Filter Options</h2>
                        <h3 className="font-semibold mb-2">Must-Have Ingredients</h3>
                        <ul className="list-inside mb-4">
                            {ingredients.map(ingredient => (
                                <li key={ingredient} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filterMustHaveIngredients.includes(ingredient)}
                                        onChange={() => handleIngredientToggle(ingredient)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="py-2 px-4 rounded-full bg-gray-300 text-black font-bold mx-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFilterApply}
                                className="py-2 px-4 rounded-full bg-[#4F6367] text-white hover:bg-[#B8D8D8] hover:text-black font-bold mx-2"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOfStorePage;
