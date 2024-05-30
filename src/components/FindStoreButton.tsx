import React from 'react';

interface Disabled {
    d: boolean;
}

const FindStoreButton: React.FC<Disabled> = ({ d }) => {
    let disableColor = "bg-[#E3E5E5] text-[#979C9E]";
    let notDisableColor = "bg-[#7A9E9F] text-[#FFFFFF]";
    let color = d? disableColor: notDisableColor;

    return (
        <button
            className={`${color} rounded-[48px] flex-grow
            w-[285px] h-[44px] py-[14px] items-center flex justify-center`}
            disabled={d} // Add the disabled attribute conditionally
        >
            Find Store
        </button>
    );
};

export default FindStoreButton;
