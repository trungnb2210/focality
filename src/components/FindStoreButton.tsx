"use client";

import React from 'react';
import Link
 from 'next/link';
interface FindStoreButtonProp {
    d: boolean;
    ingredientList: string[];
}

const FindStoreButton: React.FC<FindStoreButtonProp> = ({ d, ingredientList }) => {
    let disableColor = "bg-[#E3E5E5] text-[#979C9E]";
    let notDisableColor = "bg-[#1C941F] text-[#FFFFFF]";
    let color = d? disableColor: notDisableColor;

    return (
        <Link
            href={{
                pathname: "list-of-store-page",
                query: {
                    ingredients: ingredientList
                }
            }}
            className={`${color} rounded-[48px] flex-grow
            w-[285px] h-[44px] py-[14px] items-center flex justify-center`}
        >
            Find Store
        </Link>
    );
};

export default FindStoreButton;
