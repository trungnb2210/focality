import React, { useRef, useState, useEffect } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { Store } from "../pages/userside/store";
import { IoClose } from 'react-icons/io5';
import { TiTick } from "react-icons/ti";

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

interface ItemComponentProp {
    store: Store;
    ingredients: string[];
    distance: number;
}

const ItemComponent: React.FC<ItemComponentProp> = ({ store, ingredients, distance }) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const availableItems = store.items.filter(item =>
        ingredients.some(ingredient =>
            item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
            (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
        )
    );

    const unavailableItems = ingredients.filter(ingredient =>
        !store.items.some(item =>
            item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
            (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
        )
    );

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <div className="bg-white drop-shadow-sm rounded-xl overflow-hidden h-[200px] w-full sm:w-2/3 mb-1 cursor-pointer" onClick={toggleModal}>
                <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-full object-cover" />
            </div>
            <div className="w-full sm:w-2/3 mb-5">
                <div className="flex justify-between items-center">
                    <div className=" inline-flex flex-row drop-shadow-sm">
                        <h3 className="text-xl">{store.name}</h3>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center bg-opacity-70 text-sky-500 ml-2 w-fit pr-2 rounded-xl text-sm">
                            <IoLocationSharp size={20} />
                            <p className="">{store.sortcode}</p>
                        </a>
                    </div>
                    <div className="py-2 backdrop-filter backdrop-blur-lg rounded-2xl bg-opacity-70 border-[#E23E3E]/50 h-fit">
                        <h3 className="font-semibold">{distance.toFixed(2)} km</h3>
                    </div>
                </div>
                <div className="mb-4 divide-y divide-gray-300">
                                {availableItems.map(item => (
                                    <div key={item.iid} className="pt-2 pb-1 flex items-center text-sm">
                                        {item.imageUrl &&
                                            <img
                                                src={item.imageUrl}
                                                alt={`Image of ${item.nativeName ? item.nativeName : item.name}`}
                                                className="w-6 h-6 mr-2"
                                            />}
                                        {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - <span className="font-semibold"> £{item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                {/* <div className="bg-white px-4 py-2 flex flex-col h-fit">
                    <div>
                        <div><span className="font-semibold">Email: </span>{store.email}</div>
                        <div><span className="font-semibold">Phone Number:</span> {store.phoneNo}</div>
                    </div>
                    <div className="flex flex-row border-b-[1px] text-sm">
                        <div className="flex-grow mt-2">
                            <h4 className="font-semibold text-[#1C941F] mb-2 text-base">Ingredients Available:</h4>
                            <div className="divide-y divide-gray-300 w-10/12 text-sm">
                                {availableItems.slice(0, 2).map(item => (
                                    <div key={item.iid} className="text-gray-700 flex items-center py-2">
                                        {item.imageUrl &&
                                            <img
                                                src={item.imageUrl}
                                                alt={`Image of ${item.nativeName ? item.nativeName : item.name}`}
                                                className="w-6 h-6 mr-2"
                                            />}
                                        {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - <span className="font-bold"> £{item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-grow mt-2">
                            <h4 className="font-semibold text-[#E23E3E] mb-2 text-base">Ingredients Unavailable:</h4>
                            <div className="divide-y divide-gray-300 text-sm">
                                {unavailableItems.slice(0, 2).map(ingredient => (
                                    <div key={ingredient} className="text-gray-700 flex items-center 
                                        py-2 w-10/12">{ingredient}
                                        <div className="w-6 h-6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="mt-1 text-blue-500 hover:text-blue-700 self-center h-full" 
                        onClick={toggleModal}>View More</button>
                </div> */}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto h-screen">
                    <div className="bg-white rounded-lg max-w-md w-full overflow-auto my-auto">
                        <div className="relative h-64">
                            <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-64 object-cover" />
                            <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2" onClick={toggleModal}>
                                <IoClose size={20} />
                            </button>
                            <span className="absolute bottom-2 right-0 text-sm mr-2 font-semibold text-white bg-[#FE5F55] px-1 py-2 backdrop-filter backdrop-blur-lg rounded-2xl bg-opacity-70 border-[#E23E3E]/50"> 
                            {store.distance.toFixed(2)} km</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">{store.name}</h2>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center bg-opacity-70 text-sky-500 w-fit rounded-xl text-sm">
                                <IoLocationSharp size={20} />
                                <p className="">{store.sortcode}</p>
                            </a>
                            <p className="mb-1 text-sm"><span className="font-semibold">Email: </span>{store.email}</p>
                            <p className="mb-2 text-sm"><span className="font-semibold">Phone Number: </span>{store.phoneNo}</p>
                            <h3 className="font-semibold mb-2 text-[#1C941F]"><TiTick size={20}/></h3>
                            <div className="mb-4 divide-y divide-gray-300">
                                {availableItems.map(item => (
                                    <div key={item.iid} className="pt-2 pb-1 flex items-center text-sm">
                                        {item.imageUrl &&
                                            <img
                                                src={item.imageUrl}
                                                alt={`Image of ${item.nativeName ? item.nativeName : item.name}`}
                                                className="w-6 h-6 mr-2"
                                            />}
                                        {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - <span className="font-semibold"> £{item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <h3 className="font-semibold mb-2 text-[#E23E3E]"><IoClose size={20}/></h3>
                            <div className="mb-4 divide-y divide-gray-300">
                                {unavailableItems.map(ingredient => (
                                    <div key={ingredient} className="pt-2 pb-1 text-gray-700 text-sm">
                                        {ingredient}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default ItemComponent;
