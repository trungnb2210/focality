import { GetServerSideProps } from 'next';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import React from 'react';
import prisma from '../../lib/prisma';
import { IoLocationSharp } from "react-icons/io5";


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
}

interface ListOfStorePageProps {
    stores: Store[];
    ingredients: string[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients } = context.query;
    const ingredientsArray = undefined != ingredients
    ? (Array.isArray(ingredients) ? ingredients : [ingredients])
    : [];

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

    const sortedStores = stores.map(store => {
        const matchedIngredients = store.items.filter(item =>
            ingredientsArray.some(ingredient =>
                item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
            )
        ).length;
        return { ...store, matchedIngredients };
    }).sort((a, b) => b.matchedIngredients - a.matchedIngredients);

    return {
        props: {
            stores: sortedStores,
            ingredients: ingredientsArray,
        },
    };
}

const ListOfStorePage: React.FC<ListOfStorePageProps> = ({ stores, ingredients }) => {
    return (
        <div className="flex flex-col h-screen">
        <NavBar brandName='Stores List'/>
        <main className="flex-grow overflow-y-auto p-6">
            {stores.map((store) => (
            <div key={store.sid.toString()} className="mb-8 bg-white drop-shadow-2xl rounded-lg mx-auto max-w-4xl relative overflow-hidden">
                <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-50 md:h-full object-cover rounded-lg"/>
                <div className="absolute bottom-0 right-0 p-4 bg-white rounded-lg mx-4 mb-4">
                <h3 className="text-2xl font-semibold">{store.name}</h3>
                <div className="flex flex-row items-center space-x-2">
                    <IoLocationSharp size={24} className="text-[#35A7FF]"/>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[#35A7FF] hover:text-[#38618C]">
                    <p className="font-bold">Location</p>
                    </a>
                </div>
                <div className="mt-3">
                    <h4 className="text-lg font-semibold text-[#1C941F]">Ingredients Available:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                    {store.items.filter(item =>
                        ingredients.some(ingredient =>
                        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                        (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                        )
                    ).map(item => (
                        <li key={item.iid.toString()} className="text-gray-700">
                        {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - £{item.price.toFixed(2)}
                        </li>
                    ))}
                    </ul>
                    <h4 className="text-lg font-semibold mt-4 text-[#E23E3E]">Ingredients Unavailable:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                    {ingredients.filter(ingredient =>
                        !store.items.some(item =>
                        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                        (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                        )
                    ).map(ingredient => (
                        <li key={ingredient} className="text-gray-700">{ingredient}</li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            ))}
            {stores.length === 0 && (
            <p className="text-center text-gray-600 mt-8">No stores found for the given ingredients.</p>
            )}
        </main>
        </div>
    );
};

export default ListOfStorePage;