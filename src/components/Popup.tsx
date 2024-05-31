import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import SearchBar from './SearchBar';

interface PopupProps {
  ingredient: String;
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ ingredient, isOpen, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  if (!isOpen) return null;

  const handleSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleRemoveItem = () => {
    // Handle item removal
  };

  const handleSelectItem = () => {
    // Handle item selection
  };

//   idk pull from database
  const options = [
    'Any Fish Sauce',
    'Bagoong (Philippines)',
    'Budu Sauce (Malaysia)',
    'Kapi (Thailand)',
    'Nước Mắm (Vietnam)'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Type of {ingredient}</h2>
          <button onClick={onClose}>
            <FaTimes color="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          {/* <SearchBar placeholder='Thailand'></SearchBar> */}
          <div className="overflow-y-auto max-h-64 mt-4">
            {options.map((option) => (
              <div key={option} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleSelect(option)}
                  className="mr-2"
                />
                <label className="text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={handleRemoveItem}
            className="bg-red-500 text-white rounded-full px-4 py-2"
          >
            Remove Item
          </button>
          <button
            onClick={handleSelectItem}
            className="bg-green-500 text-white rounded-full px-4 py-2"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
