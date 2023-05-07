import React, { useEffect, useRef } from "react";


interface Props {
    children: React.ReactNode[] | React.ReactNode;
    formData: any;
    validateBeforeSubmit?: (data: any) => boolean;
    onSubmit: (data: any) => void;
    submitLabel?: string;
}


const SinglepartForm: React.FC<Props> = ({ children, submitLabel, formData, validateBeforeSubmit, onSubmit }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleFormSubmit = () => {
        validateBeforeSubmit && validateBeforeSubmit(formData)
        onSubmit(formData);
        /* Need to find better way to refresh select tag */
        window.location.href = window.location.href
    }

    
    return (<>
        {children}
        <button ref={buttonRef} className={`cursor-pointer px-4 py-2 border border-green-600 text-green-500 w-fit rounded-lg mt-4`} onClick={handleFormSubmit}>{submitLabel || "Submit"}</button>
    </>)
}

export default SinglepartForm;