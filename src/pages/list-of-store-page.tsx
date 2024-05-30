"use client";

import { GetServerSideProps } from 'next';
import React from 'react';
import prisma from '../../lib/primsa';

interface Store {
  sid: string;
  name: string | null;
  sortcode: string;
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
    select: {
      sid: true,
      name: true,
      sortcode: true,
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Focality</h1>
      <div>
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store.sid} className="store">
              <p>{store.name} : {store.sortcode}</p>
            </div>
          ))
        ) : (
          <p>No stores found for the given ingredients.</p>
        )}
      </div>
    </main>
  );
};

export default ListOfStorePage;
