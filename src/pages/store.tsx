import { GetServerSideProps } from 'next';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import React, { useState } from 'react';
import prisma from '../../lib/prisma';
import ItemComponent from '@/components/storeItem';

interface Item {
    iid: string;
    name: string;
    nativeName: string;
    price: number;
    imageUrl: string;
    description: string;
    storeId: string;
    store: Store;
}

interface Store {
    sid: string;
    name: string | null;
    sortcode: string;
    imageUrl: string;
    items: Item[];
    availableItems: string[];
    unavailableItems: string[];
    distance: number;
    matchedIngredients: number;
}

interface ListOfStorePageProps {
    stores: Store[];
    ingredients: string[];
    currentLocation: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients, currentLocation } = context.query;
    const ingredientsArray = ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : [];
    const location = Array.isArray(currentLocation) ? currentLocation[0] : currentLocation;

    const stores = await prisma.store.findMany({
        where: {
            items: {
                some: {
                    OR: ingredientsArray.map(ingredient => ({
                        OR: [
                            { name: { contains: ingredient, mode: 'insensitive' } },
                            { nativeName: { contains: ingredient, mode: 'insensitive' } }
                        ]
                    }))
                },
            },
        },
        include: {
            items: true,
        },
    });

    const calculateDistance = async (address1: string, address2: string): Promise<number> => {
        const api_key: string = "AIzaSyAZQITL5AWcrnNWaeh_zQpllcI-5fPGmC4";

        const response1 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address1}&key=${api_key}`);
        const data1 = await response1.json();
        const lat1 = data1.results[0]?.geometry?.location?.lat;
        const lon1 = data1.results[0]?.geometry?.location?.lng;

        const response2 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address2}&key=${api_key}`);
        const data2 = await response2.json();
        const lat2 = data2.results[0]?.geometry?.location?.lat;
        const lon2 = data2.results[0]?.geometry?.location?.lng;

        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.asin(Math.sqrt(a));

        return R * c;
    }

    const deg2rad = (deg: number): number => {
        const changeIngredientList = (newName: string, index:number) => {
            console.log(ingredientList)
            let newList = ingredientList
            newList[index] = newName
            setIngredientList(newList)
            console.log(ingredientList)
        }
        return deg * (Math.PI / 180);
    }

    const storesWithDistance = await Promise.all(stores.map(async store => {
        const distance = await calculateDistance(store.sortcode, location || "");
        const availableItems = store.items.filter(item =>
            ingredientsArray.some(ingredient =>
                item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
            )
        );
        const availableItemsName = availableItems.map(i => i.nativeName ? i.nativeName : i.name);
        const unavailableItems = ingredientsArray.filter(ingredient =>
            !store.items.some(item =>
                item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
            )
        );
        const matchedIngredients = availableItems.length;
        return { ...store, availableItemsName, matchedIngredients, unavailableItems, distance };
    }));

    const sortedStores = storesWithDistance.sort((a, b) => b.matchedIngredients - a.matchedIngredients);

    return {
        props: {
            stores: sortedStores,
            ingredients: ingredientsArray,
            currentLocation: location,
        },
    };
}

const ListOfStorePage: React.FC<ListOfStorePageProps> = ({ stores, ingredients, currentLocation }) => {
    const [sortCriteria, setSortCriteria] = useState('matchedIngredients');

    const sortedStores = stores.sort((a, b) => {
        if (sortCriteria === 'distance') {
            return a.distance - b.distance;
        }
        return b.matchedIngredients - a.matchedIngredients;
    });

    return (
        <div className="flex flex-col h-screen">
            <NavBar brandName='Stores List'/>
            <main className="flex-grow flex flex-col justify-start  px-4 py-6">
                <div className="mb-4 text-left font-medium w-2/3">
                    <p className="content-fit p-2 inline rounded-2xl drop-shadow-sm">
                        {currentLocation}
                    </p>
                </div>
                <div className="flex flex-row justify-between mb-4 sm:w-full">
                    {/* <div className="flex-grow">
                        <p>Currently sorted by: {sortCriteria === 'matchedIngredients' ? 'Matched Ingredients' : 'Distance'}</p>
                    </div> */}
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
                <div className="w-full flex flex-col items-center space-y-4">
                    {sortedStores.map((store) => (
                        <ItemComponent key={store.sid} store={store} ingredients={ingredients} distance={store.distance} />
                    ))}
                    {sortedStores.length === 0 && (
                        <p className="text-center text-gray-600 mt-8">No stores found for the given ingredients.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListOfStorePage;
