import React from "react";
import { BoxChecked, BoxUnchecked } from "./svg";

interface Props {
    label?: string;
    options: string[];
    selectedOptions: string[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiCheck: React.FC<Props> = ({ label, options, selectedOptions, setSelectedOptions }) => {
    return (<>
        <div className="flex flex-col w-full h-fit rounded-lg mt-3">
            <label className="text-xs font-medium text-neutral-700" htmlFor={label}>{label}</label>
            <div className="flex flex-col w-full h-fit rounded-lg">
                {
                    options.map((option, index) => {
                        return (
                            <div onClick={() => {
                                if (selectedOptions.includes(option)) {
                                    setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option))
                                } else {
                                    setSelectedOptions([...selectedOptions, option])
                                }
                            }} role={"checkbox"} className="flex items-center w-full h-fit rounded-lg mt-1 cursor-pointer">
                                <div className="mr-2">
                                    {
                                        selectedOptions.includes(option) ? <BoxChecked size={14} /> : <BoxUnchecked size={14} />
                                    }
                                </div>
                                <div className="text-sm text-neutral-700 select-none">{option}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </>)
}

export default MultiCheck;