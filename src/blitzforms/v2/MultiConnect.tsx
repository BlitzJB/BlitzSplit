import { UseTRPCQueryResult } from "@trpc/react-query/shared"
import React, { useState } from "react"
import { useComponentVisible } from "../utils/hooks"

interface MultiConnectProps {
    query: UseTRPCQueryResult<any, any>
    selector: (data: any) => any
    required?: boolean
    label?: string
    selectedKeys: string[]
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>
}



const MultiConnect: React.FC<MultiConnectProps> = ({ query, selector, required, label, selectedKeys, setSelectedKeys }) => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)


    const queryDone = query.isFetched

    const fieldLabel = required && label ? `${label}*` :        // If required and label, add * to label
                            !required && label ? label :        // If not required and label, use label
                            required && !label ? "Required" :   // If required and no label, use "Required"
                            "Selected" 
                            
    
    function handleOptionSelect(_key: string) {
        setSelectedKeys(prev => [...prev, _key]);
        setIsComponentVisible(false);
    }

    function handleReselect() {
        setIsComponentVisible(true);
    }

    function search(data: any[], query: string) {
        return data.filter((item: any) => {
            let searchStr = ""
            const { _search } = selector(item)
            if (_search) {
                searchStr = _search
            } else {
                Object.keys(item).forEach((key: string) => {
                    searchStr += item[key]
                })
            }
            return searchStr.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    } 

    return (<>
    <div className="mt-2" ref={ref}>
        <div className="min-h-[48px] flex justify-center flex-col relative px-4 border border-neutral-500 rounded-sm cursor-pointer pb-2">
            <div className="absolute -top-2 text-xs bg-white -ml-2 px-2">{fieldLabel}</div>
            <SelectedOption data={query.data} selector={selector} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
            <div className="relative">
                {
                    !isComponentVisible && <div onClick={e => setIsComponentVisible(!isComponentVisible)}>+ Select</div>
                }
                {
                    isComponentVisible &&
                    (<>
                        <div className="w-full absolute top-[100%] py-2 px-3 border border-neutral-600 bg-white z-10">
                            <input className="border border-neutral-700 w-[calc(100%-10px)] mb-2 px-4 py-2" placeholder="Search" type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            <div className="flex flex-col max-h-[250px] overflow-y-scroll subtle-scrollbar">
                                {
                                    queryDone ? search(query.data, searchQuery).map((data: any) => {
                                        const { _key, _search, ...rest } = selector(data)
                                        return (<SelectOption key={_key} _key={_key} rest={rest} onClick={handleOptionSelect} />)
                                    }) : 
                                    <div className="flex items-center my-2">
                                        <div className='flex justify-center items-center animate-spin-fast duration-200 rounded-full h-6 w-6 border-t-2 border-r-2 border-neutral-900'></div>
                                        <div className="ml-2">Loading</div>
                                    </div>
                                }
                            </div>
                        </div>
                        
                    </>)
                }
            </div>
        </div>
    </div>
    </>)
}

interface SelectOptionProps {
    _key: string
    rest: any
    onClick: (key: string) => void
}

const SelectOption: React.FC<SelectOptionProps> = ({ _key, rest, onClick }) => {

    return (<>
        <div key={_key} className="p-2 border-2 border-gray-400 border-b-[1px] border-t-[1px] cursor-pointer flex w-full justify-evenly items-center" onClick={e => onClick(_key)}>
            {Object.keys(rest).map((key: string, index) => {
                return (<div key={key} className={"flex flex-col " + (index === Object.keys(rest).length-1 ? "mr-auto" : "")}>
                    {/* <div className="font-bold text-xs text-neutral-400">{key}</div> */}
                    <div>{rest[key]}</div>
                </div>)
            })}
        </div>
    </>)
}


interface SelectedOptionProps {
    data: any
    selector: (data: any) => any
    selectedKeys: string[]
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>
}

const SelectedOption: React.FC<SelectedOptionProps> = ({ data, selector, selectedKeys, setSelectedKeys }) => {


    return (<div className="mt-2">
        {
            selectedKeys.map((key: any, index) => {
                const item = data.find((item: any) => {
                    const { _key } = selector(item)
                    return _key === key
                })
                const { _key, _search, ...rest } = selector(item)
                return (<>
                    <div key={_key} className="cursor-pointer flex w-full justify-evenly items-center px-3 py-2 border border-neutral-600 mb-1 rounded-sm">
                        {Object.keys(rest).map((key: string, index) => {
                            return (<div key={key} className={"flex flex-col " + (index === Object.keys(rest).length-1 ? "mr-auto" : "")}>
                                <div>{rest[key]}</div>
                            </div>)
                        })}
                        <div onClick={e => {
                            selectedKeys.splice(index, 1)
                            setSelectedKeys([...selectedKeys])
                        }}>
                            Remove
                        </div>
                    </div>
                </>)
            })
        }
    </div>)


}

export default MultiConnect