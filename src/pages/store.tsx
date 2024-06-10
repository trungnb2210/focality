import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Loader } from '@googlemaps/js-api-loader';
import { GetServerSideProps } from 'next';
import "../app/globals.css";
import NavBar from '@/components/NavBar';
import ItemComponent from '@/components/storeItem';
import LocationInput from '@/components/LocationInput';
import Link from 'next/link';
import { FaPlus, FaShoppingCart } from 'react-icons/fa';
import Router, { useRouter } from 'next/router';

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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients } = context.query;
    const ingredientsArray = ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : [];

    return {
        props: {
            initialStores: [],
            ingredients: ingredientsArray,
        },
    };
}

const ListOfStorePage: React.FC<ListOfStorePageProps> = ({ initialStores, ingredients }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAZQITL5AWcrnNWaeh_zQpllcI-5fPGmC4",
        libraries,
    });

    const router = useRouter();

    const [stores, setStores] = useState<Store[]>(initialStores);
    const [currentLocation, setCurrentLocation] = useState<string>("");

    const fetchStores = async (location: string) => {
        const ingredientsParam = encodeURIComponent(JSON.stringify(ingredients));
        const locationParam = encodeURIComponent(location);
        const response = await fetch(`/api/distance?ingredients=${ingredientsParam}&currentLocation=${locationParam}`);
        const data = await response.json();
        setStores(data.stores);
        setCurrentLocation(location);
    };
    

    const handleLocationSelect = (location: string) => {
        fetchStores(location);
    };

    const [sortCriteria, setSortCriteria] = useState('matchedIngredients');

    const sortedStores = stores.sort((a, b) => {
        if (sortCriteria === 'distance') {
            return a.distance - b.distance;
        }
        return b.matchedIngredients - a.matchedIngredients;
    });

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-screen">
            <NavBar brandName='Stores List' />
            <div className="p-4 drop-shadow-sm lg:flex lg:justify-between">
                <div className="flex">
                    <LocationInput onLocationSelect={handleLocationSelect} />
                    <button
                    onClick={() => router.push({ pathname: "/ingredients", query: { ingredients: ingredients } })}
                    className="w-min h-min relative py-2 px-4 ml-2 rounded-full bg-[#EEF5DB] text-[#3E3F3B]
                    hover:bg-[#3E3F3B] hover:text-[#EEF5DB] font-bold border-2 border-[#3E3F3B]
                    flex items-center justify-center mt-2"
                    >
                        <FaShoppingCart/>
                        {ingredients.length > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-sm bg-red-600 text-white rounded-full px-2">
                            {ingredients.length}
                            </span>
                        )}
                    </button>
                </div>
                <div className="flex-shrink-0">
                    <select
                        value={sortCriteria}
                        onChange={(e) => setSortCriteria(e.target.value)}
                        className="content-fit p-2 inline rounded-2xl drop-shadow-sm"
                    >
                        <option value="matchedIngredients">Sort by Available Ingredient</option>
                        <option value="distance">Sort by Distance</option>
                    </select>
                </div>
            </div>
            <main className="flex-grow flex flex-col justify-start px-4 py-6 mb-12">
                {/* {currentLocation && (
                    <div className="mb-4 text-left font-medium w-2/3">
                        <p className="content-fit p-2 inline rounded-2xl drop-shadow-sm">
                            {currentLocation}
                        </p>
                    </div>
                )} */}
                <div className="w-full flex flex-col items-center space-y-4">
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
                <Link
                    href={{
                        pathname: "search",
                        query: { ingredients: ingredients }
                    }}
                    className="p-2 px-4 rounded-[67px] bg-red-600
                    text-white items-center flex justify-center hover:bg-red-300 hover:text-white
                    drop-shadow-2xl"
                >
                    <div className="font-semibold">More Ingredient</div>
                    {/* <FaPlus size={20} /> */}
                </Link>
           </footer>
        </div>
    );
};

export default ListOfStorePage;
