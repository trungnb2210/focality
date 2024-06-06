import { IoClose } from "react-icons/io5"
import React, { useState, useEffect } from 'react'
import { queryDatabase } from '@/components/SearchBar';
// import { MultiSelect, Option } from "react-multi-select-component";



type ItemProp = {
    iid: string;
    name: string;
    nativeName?: string;
    desc: string;
}

type IngredientProp = {
    ingredient: string;
    index: number;
    removeMethod: (i: number) => void;
    changeMethod: (name: string, i: number) => void;
}

// const 

const DownDownIngredient: React.FC<IngredientProp> = ({ ingredient, index, removeMethod, changeMethod}) => {
    const [expand, setExpand] = useState(false)
    const [queryRes, setQueryRes] = useState<string[]>([])
    const [ingredientName, setIngredientName] = useState<string>(ingredient)
    // const [options, setOptions] = useState<Option[]>([])
    // const [selected, setSelected] = useState([]);


    const ingQuery = ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient


    // May need to change to get all choices instead of just ones in database
    
    // const choiceList = await queryDatabase(ingredient)
    // const choices: string[] = Array.isArray(choiceList) ? choiceList : [choiceList]

    const fetchChoices = async () => {
        const choiceList = await queryDatabase(ingQuery);
        const nativeNames = choiceList.map((x: { nativeName: string; }) => x.nativeName)
        const optionsArr = [ingredient].concat(nativeNames)
        // const options = optionsArr.map(x => {value: x, label: x})
        setQueryRes(optionsArr)
        // let options = [];
        // queryRes.forEach(function(element) {
        //     options.push({ label:element, value: element })
        // });



    };

    const handleChange = (qr: string, i: number) => {
        setIngredientName(qr)
        changeMethod(qr, i)
    }

    const handleExpand = () => {
        if (ingredient.startsWith("Any ")) {
            fetchChoices()
        }
        setExpand(!expand)
    }

    return (
        <div
        // key={index}
        // className="relative w-[343px] h-[54px] rounded-lg overflow-hidden drop-shadow-2xl"
        >
            <div
                className="relative w-[343px] h-[54px] rounded-lg overflow-hidden flex justify-between items-center bg-[#4F6367] text-white transition duration-300 ease-in-out"
            >
                <button
                    onClick={handleExpand}
                    className="w-[90%] h-full text-left border-white"
                // className="relative w-[343px] h-[54px] rounded-lg overflow-hidden flex justify-between items-center bg-[#4F6367] text-white transition duration-300 ease-in-out"

                // className="absolute inset-0 z-10 flex justify-between items-center w-full h-full bg-[#4F6367] text-white  transition duration-300 ease-in-out"
                // onClick={() => removeIngredient(index)}
                >
                    <span className="ml-5">{ingredientName}</span>

                </button>
                <IoClose size={24} className='mr-2 h-full' onClick={() => removeMethod(index)} />

            </div>


            {expand &&
                <div className="bg-white border rounded-lg">
                    <ul>
                        {queryRes.map((qr, i) => <li className="pl-5 hover:bg-[#3E3F3B] hover:text-[#EEF5DB]" key={i} onClick={()=>handleChange(qr, index)}>{qr}</li>)}
                    </ul> 
                    {/* <MultiSelect
                        options={options}

                        value={selected}
                        onChange={setSelected}
                        labelledBy={ingredient}
                    /> */}
                </div>
            }
        </div>

    );
};

export default DownDownIngredient;