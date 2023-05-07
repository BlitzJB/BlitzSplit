import React from "react";
import { useState, useEffect } from 'react';


/* NOTE: Requires Imgur setup */

interface ImageUploadProps {
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    onTooLarge?: () => void
    label?: string
    name?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ setUrl, onTooLarge, label, name }) => {
    const [addedFiles, setAddedFiles] = React.useState<FileList | null>(null)
    const [success, setSuccess] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const [uploading, setUploading] = React.useState<boolean>(false)
    const [freshLoad, setFreshLoad] = React.useState<boolean>(true)
    
    const [fetchUrl, setFetchUrl] = useState("");

    useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        setFetchUrl(`${window.location.origin}/api/imageUpload`);
      } else {
        setFetchUrl("http://localhost:3000/api/imageUpload");
      }
    }, []);
    
    const fileInputRef = React.useRef<HTMLInputElement>(null)


    if (addedFiles && addedFiles.length > 1 && addedFiles[0]) {
        setAddedFiles(null)
        setError("Select only one file")
    }


    const uploadFiles = () => {
        if (success) return

        if (addedFiles && addedFiles.length === 1) {
            const file = addedFiles[0]

            if (file) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const result = reader.result
                    if (typeof result === "string") {
                        const base64 = result.split(",")[1]
                        if (base64) {
                            setUploading(true)
                            fetch(fetchUrl, {
                                method: "POST",
                                body: JSON.stringify({
                                    image: base64
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(res => {
                                if (res.status === 413) {
                                    setError("File too large")
                                }
                                return res.json()
                            }).then(data => {
                                if (data) {
                                    setSuccess(true)
                                    setUploading(false)
                                    setUrl(data.data.link)
                                }
                            })
                        }
                    }
                }
            }
        }
    }



    return (<>
        <div className="flex flex-col h-fit rounded-lg mt-3 w-fit">
            {label && <label className="text-xs font-medium text-neutral-700" htmlFor={label}>{label}</label>}
            {
                freshLoad ?
                    <button onClick={() => fileInputRef.current?.click()} className="cursor-pointer px-4 py-2 border border-neutral-500 w-fit rounded-lg mt-1">
                        Choose Files
                    </button> :
                    <div className="flex items-center">
                        <button onClick={uploadFiles} className={`cursor-pointer px-4 py-2 border ${uploading || success ? "border-neutral-300 text-neutral-400" : "border-neutral-600"} w-fit rounded-lg mt-1`}>
                            {
                                uploading ? "Uploading..." : success ? "Uploaded" : "Upload"
                            }
                        </button>
                        {
                            addedFiles && addedFiles[0] && <div className="text-neutral-700 select-none ml-2 mt-1"><b>File chosen:</b> {addedFiles[0].name} <button onClick={(e) => { setAddedFiles(null); fileInputRef.current?.click() }} className="text-blue-800 font-bold ml-1">change</button></div>
                        }
                    </div>
            }
            <input ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { setAddedFiles(e.target.files); setSuccess(false); setFreshLoad(false) }} type="file" name={name} />
            {
                error && <div className="text-red-500 text-sm mt-1">{error}</div>
            }
        </div>
    </>)
}

export default ImageUpload;