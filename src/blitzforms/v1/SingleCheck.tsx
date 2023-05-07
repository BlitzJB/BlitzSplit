import React from "react";

import { BoxChecked, BoxUnchecked } from "./svg";

interface Props {
    label?: string;
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleCheck: React.FC<Props> = ({ label, value, setValue }) => {
    return (<>
        <div onClick={() => setValue(!value)} role={"checkbox"} className="flex items-center w-full h-fit rounded-lg mt-3 cursor-pointer">
            <div className="mr-2">
                {
                    value ? <BoxChecked size={14} /> : <BoxUnchecked size={14} />
                }
            </div>
            <div className=" text-sm text-neutral-700 select-none">{label}</div>
        </div>
    </>)
}

export default SingleCheck;