import React from "react";

interface Option {
    value: string;
    label: string;
}

interface Props {
    label: string;
    options: Option[];
    selectedOption: string;
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}

const SingleSelect: React.FC<Props> = ({ label, options, selectedOption, setSelectedOption }) => {
    return (<>
        <div className="flex flex-col w-full rounded-lg mt-3">
            <label className="text-xs font-medium text-neutral-700 mb-1" htmlFor={label}>{label}</label>
            <select className="border-b border-neutral-700 mt-auto" onChange={(e) => setSelectedOption(e.currentTarget.value)} name={label} >
                <option value={"#"} selected>Select an option</option>
                {
                    options.map((option, index) => {
                        return (
                            <option className={`${selectedOption === option.value ? "bg-neutral-200" : ""}`} key={index} value={option.value}>{option.label}</option>
                        )
                    })
                }
            </select>
        </div>
    </>)
}

export default SingleSelect;