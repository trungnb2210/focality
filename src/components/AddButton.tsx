import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import SearchIngredientPage from '@/pages/client/search-ingredient-page';

const AddButton: React.FC = () => {
  const router = useRouter();

  const goToSearch = () => {
    router.push('/search-ingredient-page');
  }

  return (
    <button
        onClick={goToSearch}  // Ensure to call goToSearch function on click
        className="w-[44px] h-[44px] py-[14px] px-[16px] rounded-[67px] bg-[#4F6367] text-white items-center flex justify-center">
      <FaPlus size={24} />
    </button>
  );
};

export default AddButton;
