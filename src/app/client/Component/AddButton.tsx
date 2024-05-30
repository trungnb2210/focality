import React from 'react';
import { FaPlus } from "react-icons/fa6";

const AddButton: React.FC = () => {
    return (
        <button className="w-[44px] h-[44px] py-[14px] px-[16px] rounded-[67px]
        bg-[#4F6367] text-white items-center flex justify-center">
            <FaPlus size={24}/>
        </button>
    );
};

export default AddButton;
