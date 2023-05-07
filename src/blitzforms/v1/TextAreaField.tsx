import React from "react";


interface Props {
    label?: string;
    name?: string;
    placeholder?: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}


const TextAreaField: React.FC<Props> = ({ label, name, placeholder, value, setValue }) => {
    
    return (<>
        <div className="flex flex-col w-full h-fit rounded-lg mt-3">
            <label className="text-xs font-medium text-neutral-700 mb-1" htmlFor={name}>{label}</label>
            <textarea
                className="w-full h-10 px-2 rounded-sm bg-transparent border border-neutral-500"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    </>)
}

export default TextAreaField;