
interface ItemProp {
    iid: string;
    name: string;
    nativeName?: string;
    desc: string;
}

interface IngredientProp {
    ingredient: string;
    index: number;
}

const IngredientComponent: React.FC<IngredientProp> = ({ingredient, index}) => {

    return (
        // <div
        //     key={index}
        //     className="relative w-[343px] h-[54px] rounded-lg overflow-hidden drop-shadow-2xl"
        //     onMouseEnter={() => handleMouseEnter(index)}
        //     onMouseLeave={() => handleMouseLeave(index)}
        // >
        //     <button
        //         className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367] text-white  transition duration-300 ease-in-out"
        //         onClick={() => removeIngredient(index)}
        //     >
        //         <span className="ml-5">{ingredient}</span>
        //         <IoClose size={24} className='mr-2'/>
        //         {hoverStates[index] &&
        //             (<div className="absolute inset-0 bg-[#FE5F55] bg-opacity-70 flex items-center justify-center">
        //                 <span className="text-white font-bold">Remove Item</span>
        //             </div>)
        //         }
        //     </button>
        // </div>
        <h1>hi</h1>
        
    );
};

export default IngredientComponent;