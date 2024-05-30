"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
// import ListOfStorePage from '@/pages/list-of-store-page';

interface Disabled {
    d: boolean;
}

const FindStoreButton: React.FC<Disabled> = ({ d }) => {
    let disableColor = "bg-[#E3E5E5] text-[#979C9E]";
    let notDisableColor = "bg-[#1C941F] text-[#FFFFFF]";
    let color = d? disableColor: notDisableColor;
    let ingredients = ["adfadsf"];
    const router = useRouter();

    const handleClick = () => {
        if (!d) {
            router.push(`list-of-store-page?ingredients=${encodeURIComponent(JSON.stringify(ingredients))}`)
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`${color} rounded-[48px] flex-grow
            w-[285px] h-[44px] py-[14px] items-center flex justify-center`}
            disabled={d} // Add the disabled attribute conditionally
        >
            Find Store
        </button>
    );
};

export default FindStoreButton;
