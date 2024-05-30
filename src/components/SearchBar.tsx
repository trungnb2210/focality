import React from 'react';
import { IoSearchOutline } from "react-icons/io5";

interface SearchBarProps {
  placeholder: string;
  onEnterPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onEnterPress }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onEnterPress();
    }
  };

  return (
    <div className="flex items-center bg-[#F8FAFC] px-[16px] py-[8px] border-[1px] rounded-[8px] w-[343px]">
      <IoSearchOutline color='grey'/>
      <input
        type="text"
        placeholder={`e.g ${placeholder}`}
        onKeyPress={handleKeyPress}
        className="bg-[#F8FAFC] outline-none flex-grow text-[#64748B] ml-[8px]"
      />
    </div>
  );
};

export default SearchBar;
