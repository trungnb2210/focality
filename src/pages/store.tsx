import { GetServerSideProps } from 'next';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import React from 'react';
import prisma from '../../lib/prisma';
import { IoLocationSharp } from "react-icons/io5";
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
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                {stores.map((store) => (
                    <ItemComponent key={store.sid} store={store} ingredients={ingredients} />
                ))}
                {stores.length === 0 && (
                    <p className="text-center text-gray-600 mt-8">No stores found for the given ingredients.</p>
                )}
            </main>
        </div>
    );
};

export default ListOfStorePage;