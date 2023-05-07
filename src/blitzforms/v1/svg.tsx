import React from "react"


interface BoxProps {
    size: number;
}

export const BoxChecked: React.FC<BoxProps> = ({ size }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="7" fill="#282828"/>
            <path d="M17 62L41.4706 81L82 19" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export const BoxUnchecked: React.FC<BoxProps> = ({ size }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="7" stroke="#282828" stroke-width="20" mask="url(#path-1-inside-1_1_2)"/>
        </svg>
    )
}