import React, { useCallback, useEffect } from "react";


interface Props {
    children: React.ReactNode[] | React.ReactNode;
    currentStep: number;
    formData: any;
    validateBeforeSubmit?: (data: any) => boolean;
    onSubmit: (data: any) => void;
}


const MultipartForm: React.FC<Props> = ({ children, currentStep, formData, validateBeforeSubmit, onSubmit }) => {
    const handleFormSubmit = () => {
        validateBeforeSubmit && validateBeforeSubmit(formData)
        onSubmit(formData);
    }

    const length = React.Children.count(children);

    if (currentStep > length) {
        handleFormSubmit();
    }
    
    return (<>
        {children}
    </>)
}

export default MultipartForm;