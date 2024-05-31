import { GetServerSideProps } from 'next';
import "../app/globals.css";
import NavBar from '../components/NavBar';
import React from 'react';
import prisma from '../../lib/prisma';

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

  // Query stores that have any of the listed ingredients
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
      items: true, // Include items to filter them later in the component
    },
  });

  // Sort stores based on the number of matched ingredients
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
          <div key={store.sid.toString()} className="mb-8 p-4 bg-white shadow-lg rounded-lg mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row">
              <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full md:w-1/3 h-56 object-cover rounded-lg"/>
              <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
                <h3 className="text-2xl font-semibold">{store.name}</h3>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {store.sortcode}
                </a>
                <div className="mt-3">
                  <h4 className="text-lg font-semibold">Ingredients Available:</h4>
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
                  <h4 className="text-lg font-semibold mt-4">Ingredients Unavailable:</h4>
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
