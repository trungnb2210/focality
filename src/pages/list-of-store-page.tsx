import { GetServerSideProps } from 'next';
import "../app/globals.css"
import NavBar from '../components/NavBar';
import React from 'react';
import prisma from '../../lib/primsa';

interface Item {
    iid: String
    name: String
    nativeName: String
    price: number
    imageUrl: String
    description: String
    storeId: String
    store: Store
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
          {stores.map((store) => (
            <div key={store.sid} className="mb-4 p-4 bg-white shadow rounded-lg mx-10">
              <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-56 object-cover rounded-lg"/>
              <div className="mt-3">
                <h3 className="text-lg font-semibold">{store.name}</h3>
                <div className="flex flex-col mt-2">
                  <strong>Ingredients Available:</strong>
                  <ul>
                    {store.items.filter(item =>
                      ingredients.some(ingredient =>
                        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                        (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                      )
                    ).map(item => (
                      <li key={item.iid}>{item.name} ({item.nativeName || 'N/A'})</li>
                    ))}
                  </ul>
                  <strong>Ingredients Unavailable:</strong>
                  <ul>
                    {ingredients.filter(ingredient =>
                      !store.items.some(item => 
                        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                        (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                      )
                    ).map(ingredient => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
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

