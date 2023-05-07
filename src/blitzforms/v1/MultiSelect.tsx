import React from "react";
import { useComponentVisible } from "../utils/hooks";

interface Option {label: string, value: string}

interface Props {
    label?: string;
    options: Option[];
    selectedOptions: string[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}




const MultiSelect: React.FC<Props> = ({ label, options, selectedOptions, setSelectedOptions }) => {
    const [optionsVisble, setOptionsVisible] = React.useState(false);
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
    return (<>
        <div className="flex flex-col w-full h-fit rounded-lg mt-3">
            <label className="text-xs font-medium text-neutral-700" htmlFor={label}>{label}</label>
            <div ref={ref}>
                <div onClick={() => setIsComponentVisible(!isComponentVisible)} className="relative flex items-center w-full h-fit rounded-lg mt-1 cursor-pointer">
                    <div className="border-b border-neutral-700 w-full pl-1">
                        
                        {
                            selectedOptions.length > 0 ? options.filter(op => selectedOptions.includes(op.value)).map(op => op.label).join(", ") : "Select an option"
                        }
                    </div>
                    {
                        isComponentVisible && 
                            (
                                <div className="absolute top-6 left-0 w-full border border-neutral-700 max-h-96 overflow-y-auto ">
                                    {
                                        options.map((option, index) => {
                                            return (
                                                <div key={index} onClick={() => {
                                                    if (selectedOptions.includes(option.value)) {
                                                        setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option.value));
                                                    } else {
                                                        setSelectedOptions([...selectedOptions, option.value]);
                                                    }
                                                }} className={`flex items-center w-full h-fit rounded-lg cursor-pointer `}>
                                                    <div className={`w-full ${selectedOptions.includes(option.value) ? "bg-neutral-200" : "bg-white"} p-2 border-b border-neutral-700`}>
                                                        {option.label}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    </>)
}

export default MultiSelect;