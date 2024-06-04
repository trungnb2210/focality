import React from 'react';
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

interface ItemComponentProp {
    store: Store;
    ingredients: string[];
}

const ItemComponent: React.FC<ItemComponentProp> = ({ store, ingredients }) => {
    return (
        <div className="relative mb-8 bg-white drop-shadow-2xl rounded-lg overflow-hidden h-[400px] w-2/3">
            <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-full object-cover"/>
            <div className="absolute bottom-0 w-full">
                <div className="m-2 text-2xl bg-white px-4 py-2 backdrop-filter backdrop-blur-lg rounded-lg bg-opacity-80 inline-flex items-center">
                    <h3 className="font-semibold">{store.name}</h3>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`}
                        target="_blank" rel="noopener noreferrer"
                        className="ml-4 text-[#35A7FF] hover:text-[#38618C] inline-flex items-center">
                        <IoLocationSharp size={23}/>
                        <p className="ml-1">Location</p>
                    </a>
                </div>
                <div className="bg-white px-4 py-2 flex">
                    <div className="flex-grow border-r">
                        <h4 className="text-lg font-semibold text-[#1C941F]">Ingredients Available:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {store.items.filter(item =>
                                ingredients.some(ingredient =>
                                    item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                                    (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                                )
                            ).map(item => (
                                <li key={item.iid} className="text-gray-700">
                                    {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - £{item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-grow ml-3">
                        <h4 className="text-lg font-semibold text-[#E23E3E]">Ingredients Unavailable:</h4>
                        <ul className="list-disc list-inside space-y-1">
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
    );
};

export default ItemComponent;
