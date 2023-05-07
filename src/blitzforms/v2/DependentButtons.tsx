import { UseTRPCQueryResult, UseTRPCMutationResult } from "@trpc/react-query/shared"
import { MouseEventHandler } from "react"

export const QueriesDependentScreenLoader: React.FC<{ queries: UseTRPCQueryResult<any, any>[] }> = ({ queries }) => {
  
    const allDone = queries.every(query => query.isSuccess)

    if (allDone) {
        return <></>
    }

    return (<>
        <div className='flex justify-center items-center fixed top-0 left-0 h-screen w-screen z-50 bg-white'>
            <div className='animate-spin-fast duration-200 rounded-full h-10 w-10 border-t-2 border-r-2 border-neutral-900'></div>
        </div>
    </>)
}

export const QueriesDependentInplaceLoader: React.FC<{ queries: UseTRPCQueryResult<any, any>[] }> = ({ queries }) => {

    const allDone = queries.every(query => query.isSuccess)

    if (allDone) {
        return <></>
    }

    return (<>
        <div className='flex justify-center items-center animate-spin-fast duration-200 rounded-full h-10 w-10 border-t-2 border-r-2 border-neutral-900'></div>
    </>)
}

export const MutationsDependentScreenLoader: React.FC<{ mutations: UseTRPCMutationResult<any, any, any, any>[] }> = ({ mutations }) => {
  
    const allLoading = mutations.every(mutation => mutation.isLoading)
    if (!allLoading) {
        return <></>
    }
  
    return (<>
        <div className='flex justify-center items-center fixed top-0 left-0 h-screen w-screen z-50 bg-white'>
            <div className='animate-spin-fast duration-200 rounded-full h-10 w-10 border-t-2 border-r-2 border-neutral-900'></div>
        </div>
    </>)
}


export const MutationsDependentInplaceLoader: React.FC<{ mutations: UseTRPCMutationResult<any, any, any, any>[] }> = ({ mutations }) => {

    const allLoading = mutations.every(mutation => mutation.isLoading)
    if (!allLoading) {
        return <></>
    }

    return (<>
        <div className='flex justify-center items-center animate-spin-fast duration-200 rounded-full h-10 w-10 border-t-2 border-r-2 border-neutral-900'></div>
    </>)
}

export const MutationsDependentButton: React.FC<{ mutations: UseTRPCMutationResult<any, any, any, any>[], loadingLabel?: string, label: string, onClick: MouseEventHandler, staticClassName?: string, loadingClassName?: string, spinnerColor?: string }> = ({ mutations, loadingLabel, label, onClick, staticClassName, loadingClassName, spinnerColor }) => {

    const allLoading = mutations.every(mutation => mutation.isLoading)

    if (allLoading) {
        return <button disabled={true} className={'flex ' + (loadingClassName || "")}>
            <div className={'flex justify-center items-center animate-spin-fast duration-200 rounded-full h-5 w-5 border-t-2 border-r-2 ' + (spinnerColor || "border-neutral-900")}></div> 
            <p className='ml-2'>{loadingLabel || label}</p>
        </button>
    }

    return <button onClick={onClick} className={staticClassName}>{label}</button>

}