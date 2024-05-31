import { GetServerSideProps } from 'next';
import "../app/globals.css"
import NavBar from '../components/NavBar';
import React from 'react';
import prisma from '../../lib/primsa';

interface Store {
  sid: string;
  name: string | null;
  sortcode: string;
  imageUrl: string;
  distance: string;
  availableItems: string[];
  unavailableItems: string[];
}

interface ListOfStorePageProps {
  stores: Store[];
  ingredients: string[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients } = context.query;

    // Ensure ingredients are passed as an array of strings
    const ingredientsArray = undefined != ingredients
    ? (Array.isArray(ingredients) ? ingredients : [ingredients])
    : [];

    const stores = await prisma.store.findMany({
    where: {
        items: {
            some: {
                OR: [
                { name: { in: ingredientsArray as string[] } } ,
                { nativeName: { in: ingredientsArray as string[] } },
                ]
            },
        },
    },
    include: {
        items: true,
    },
    });

    return {
    props: {
        stores,
        ingredients: ingredientsArray,
    },
    };
}


const ListOfStorePage: React.FC<ListOfStorePageProps> = ({ stores, ingredients }) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar brandName='Stores List'/>
      <main className="flex-grow overflow-y-auto">
        {stores.map((store, index) => (
          <div key={store.sid} className="mb-4 p-4 bg-white shadow rounded-lg mx-10">
            <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-56 object-cover rounded-lg"/>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-black">{store.name}</h3>
              <div className="flex justify-between items-center mt-2">
                
              </div>
            </div>
          </div>
        ))}
        {stores.length === 0 && (
          <p>No stores found for the given ingredients.</p>
        )}
      </main>
    </div>
  );
};

export default ListOfStorePage;
