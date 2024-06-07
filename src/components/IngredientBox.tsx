import { IoClose } from "react-icons/io5"
import React, { useState, useEffect } from 'react'
import { queryDatabase } from '@/components/SearchBar';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


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

    // const originalItem = JSON.parse(JSON.stringify(ingredient));


    const [expand, setExpand] = useState(false)
    const [queryRes, setQueryRes] = useState<string[]>([])
    const [ingredientName, setIngredientName] = useState<string>('')

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [expandable, setExpandAble] = useState<boolean>()

    // const [options, setOptions] = useState<Option[]>([])
    // const [selected, setSelected] = useState([]);


    const ingQuery = ingredient.startsWith('Any ')? ingredient.substring(4) : ingredient

    useEffect(() => {
        setExpandAble(ingredient.includes("Any "))
        if (selectedOptions.length == 0)    {
            setIngredientName(ingredient)
        } else {
            setIngredientName((old) => selectedOptions.toString().length < 34 ? selectedOptions.toString() : selectedOptions.toString().slice(0, 33).concat("..."))
        }
    })

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
        // console.log(qr)


        if (qr.startsWith("Any ")) {
            // if (selectedOptions.includes(originalItem)) {
            //     setSelectedOptions([])
            // }
            if (selectedOptions === queryRes) {
                setSelectedOptions([])
                // containsAny = false
            } else {
                setSelectedOptions(queryRes)
                setIngredientName(qr)
                // containsAny = true
            }


        } else {
            setSelectedOptions((oldList) => {
                let newList = [...oldList]
                // console.log(newList)
                if (newList.includes(qr)) {
                    newList = newList.filter(x => x !== qr)
                    if (newList.length == 0) {
                        // console.log("ORIGINAL ITEM", originalItem)
                        newList = [queryRes[0]] // need to get the ANY
                    }
                } else {
                    newList = [...newList, qr]
                }
                setIngredientName((old) => newList.toString().length < 34 ? newList.toString() : newList.toString().slice(0, 33).concat("..."))
                // console.log(newList)
    
                // prev.includes(qr) ? prev.filter(item => item !== qr) : [...prev, qr]
                return newList
            });
        }


        // console.log("ORIGINAL ITEM", originalItem)
        
        // const containsAny = selectedOptions.includes(originalItem) || selectedOptions.length === 0 
        // console.log(selectedOptions.includes(originalItem), selectedOptions.length === 0 )
        changeMethod(qr, i)


        // console.log(selectedOptions)
        // setIngredientName(qr)
        // setIngredientName((old) => selectedOptions.toString())

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
                className="relative h-[54px] overflow-hidden flex justify-between
                 items-centertransition duration-300 ease-in-out flex-row"
            >
                <button
                    onClick={handleExpand}
                    className="rounded-lg text-left border-white w-[343px] bg-[#4F6367] 
                    text-white flex flex-row items-center justify-between pr-2"
                    disabled={!expandable}
                >
                    <span className="ml-5">{ingredientName}</span>
                    {expandable? (expand? <FaAngleDown/> : <FaAngleUp/>): <></> }
                </button>

                <button className="h-[54px] flex items-center rounded-lg bg-[#E23E3E] px-2 ml-2"
                onClick={() => removeMethod(index)} >
                    <div className="text-white font-semibold">Delete</div>
                </button>
            </div>


            {expand &&
                <div className="bg-white border rounded-lg">
                    <ul>
                        {queryRes.map((qr, i) => 
                            <li 
                                // className="pl-5 text-black hover:bg-[#B8D8D8] flex items-center ${selectedSuggestions.includes(qr) ? 'hover:bg-[#B8D8D8]' : 'hover:bg-gray-100'}" 
                                className={`py-1 px-3 cursor-pointer flex items-center ${selectedOptions.includes(qr) ? 'bg-[#B8D8D8]' : 'hover:bg-gray-200'}`}
                                key={i} 
                                onClick={()=>handleChange(qr, index)}>{qr}</li>)}
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