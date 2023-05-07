import React from "react";


interface Props {
    children: React.ReactNode | React.ReactNode[];
    stepIndex: number;
    currentStep: number;
}

const FormStep: React.FC<Props> = ({ children, stepIndex, currentStep }) => {
    return (<>
        {
            stepIndex === currentStep && (children)
        }
    </>)
}

export default FormStep;