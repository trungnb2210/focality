import React, { useRef, useState, useEffect } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Store } from "../pages/store";

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
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [isAtTop, setIsAtTop] = useState<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const content = contentRef.current;
            setIsOverflowing(content.scrollHeight > content.clientHeight);
            setIsAtTop(content.scrollTop === 0);
            setIsAtBottom(content.scrollHeight === content.clientHeight);
        }
    }, []);

    const handleScrollDown = () => {
        if (contentRef.current) {
            const content = contentRef.current;
            content.scrollBy({
                top: 100,
                behavior: 'smooth',
            });
            setIsAtTop(content.scrollTop === 0);
            setIsAtBottom(content.scrollTop + content.clientHeight >= content.scrollHeight);
        }
    };

    const handleScrollUp = () => {
        if (contentRef.current) {
            const content = contentRef.current;
            content.scrollBy({
                top: -100,
                behavior: 'smooth',
            });
            setIsAtTop(content.scrollTop === 0);
            setIsAtBottom(content.scrollTop + content.clientHeight >= content.scrollHeight);
        }
    };

    return (
        <div className="relative bg-white drop-shadow-2xl rounded-lg overflow-hidden h-[400px] w-full sm:w-2/3">
            <img src={store.imageUrl} alt={`Store front of ${store.name}`} className="w-full h-full object-cover"/>
            <div className="absolute bottom-0 w-full">
                <div className="flex justify-between items-center mb-2 px-4">
                    <div className="bg-white px-4 py-2 backdrop-filter backdrop-blur-lg rounded-lg bg-opacity-80 inline-flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-0">
                        <h3 className="font-semibold">{store.name}</h3>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name || '')}+${store.sortcode}`}
                            target="_blank" rel="noopener noreferrer"
                            className="mt-2 sm:mt-0 sm:ml-4 text-[#35A7FF] hover:text-[#38618C] inline-flex items-center">
                            <IoLocationSharp size={23}/>
                            <p className="ml-1">Location</p>
                        </a>
                    </div>
                    <div className="bg-[#FE5F55] px-3 py-2 backdrop-filter backdrop-blur-lg rounded-2xl bg-opacity-70 border-[#E23E3E]/50 sm:ml-4">
                        <h3 className="text-white font-bold">{distance.toFixed(1)} km</h3>
                    </div>
                </div>
                <div className="bg-white px-4 py-2 flex flex-col h-[200px] overflow-auto overscroll-contain" ref={contentRef} onScroll={() => {
                    if (contentRef.current) {
                        const content = contentRef.current;
                        setIsAtTop(content.scrollTop === 0);
                        setIsAtBottom(content.scrollTop + content.clientHeight >= content.scrollHeight);
                    }
                }}>
                    <div>
                        <div><span className="font-semibold">Email: </span>{store.email}</div>
                        <div><span className="font-semibold">Phone Number:</span> {store.phoneNo}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex-grow mt-2">
                            <h4 className="font-semibold text-[#1C941F]">Ingredients Available:</h4>
                            <ul className="list-inside list-disc space-y-1">
                                {store.items.filter(item =>
                                    ingredients.some(ingredient =>
                                        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                                        (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
                                    )
                                ).map(item => (
                                    <li key={item.iid} className="text-gray-700 flex items-center">
                                        {item.name} {item.nativeName ? `(${item.nativeName})` : ''} - £{item.price.toFixed(2)}
                                        {item.imageUrl &&
                                        <img
                                            src={item.imageUrl}
                                            alt={`Image of ${item.nativeName ? item.nativeName : item.name}`} 
                                            className="w-6 h-6 ml-2"
                                        />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-grow mt-2">
                            <h4 className="font-semibold text-[#E23E3E]">Ingredients Unavailable:</h4>
                            <ul className="space-y-1">
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
                {isOverflowing && (
                    <div className="absolute right-4 bottom-4 flex flex-col space-y-2">
                        <button
                            className={`bg-[#FE5F55] text-white rounded-full p-2 ${isAtTop ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleScrollUp}
                            disabled={isAtTop}
                        >
                            <FaArrowUp />
                        </button>
                        <button
                            className={`bg-[#FE5F55] text-white rounded-full p-2 ${isAtBottom ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleScrollDown}
                            disabled={isAtBottom}
                        >
                            <FaArrowDown />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemComponent;
