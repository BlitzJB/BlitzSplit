import React from "react";
import { useState, useEffect } from "react";

/* NOTE: Requires Imgur setup */


interface InstantImageUploadProps {
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    label?: string;
    required?: boolean;
}

type uploadStateType = "idle" | "uploading" | "success" | "error"
interface UploadState {
    state: uploadStateType
    error?: string
    url?: string
}

export const InstantImageUpload: React.FC<InstantImageUploadProps> = ({ setUrl, label, required }) => {

    const [handlerEndpoint, setHandlerEndpoint] = useState("");

    useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        setHandlerEndpoint(`${window.location.origin}/api/imageUpload`);
      } else {
        setHandlerEndpoint("http://localhost:3000/api/imageUpload");
      }
    }, []);

    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [uploadState, setUploadState] = React.useState<UploadState>({ state: "idle" })

    const fieldLabel = required && label ? `${label}*` :        // If required and label, add * to label
                            !required && label ? label :        // If not required and label, use label
                            required && !label ? "Required" :   // If required and no label, use "Required"
                            ""                                  // If not required and no label, use nothing

    const uploadFiles = (addedFiles: FileList | null) => {
        console.log(addedFiles)
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
                            setUploadState({ state: "uploading" })
                            fetch(handlerEndpoint, {
                                method: "POST",
                                body: JSON.stringify({
                                    image: base64
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(res => {
                                if (res.status === 413) {
                                    setUploadState({ state: "error", error: "File too large" })
                                }
                                return res.json()
                            }).then(data => {
                                if (data) {
                                    setUploadState({ state: "success", url: data.data.link })
                                    setUrl(data.data.link)
                                }
                            })
                        }
                    }
                }
            }
        }
    }

    const handleUploadClick = () => {
        if (uploadState.state === "uploading") return
        fileInputRef.current?.click()
    }

    return (<>
        <div className={"relative border border-neutral-600 mt-2 rounded-sm cursor-pointer flex h-12 "+ ( uploadState.state === "error" ? "border-red-500" : uploadState.state === "uploading" ? "border-neutral-500 text-neutral-500 cursor-not-allowed" : "" )} onClick={e => handleUploadClick()}>
            <div className="flex-grow px-4 py-3 flex">
                <div className={"text-xs absolute bg-white -top-2 -ml-2 px-2 flex " + ( uploadState.state === "error" ? "text-red-500" : uploadState.state === "uploading" ? "text-neutral-500" : "" )}>{fieldLabel}</div>
                <button>
                    {
                        uploadState.state === "idle" ? "Upload" :
                        uploadState.state === "uploading" ? "Uploading..." :
                        uploadState.state === "success" ? "Uploaded. Change" :
                        uploadState.state === "error" ? "Try again" : "Unknown state"
                    }
                </button>
                {
                    uploadState.state === "error" && uploadState.error && 
                        <p className=" ml-auto text-xs mt-auto">{uploadState.error}</p>   
                }
            </div>
            {
                uploadState.state === "success" && uploadState.url &&
                    <Preview url={uploadState.url} />
            }
        </div>

        <input type="file" ref={fileInputRef} className="hidden w-0 h-0" onChange={e => { console.log("event level", e.target.files); uploadFiles(e.target.files) }} />
    </>)
}

const Preview: React.FC<{ url: string }> = ({ url }) => {
    return (
        <a href={url} className="ml-auto rounded-sm cursor-pointer flex items-center py-2 px-3">
            <div className="mr-2">Preview: </div>
            <img src={url} className="w-full h-full object-cover" />
        </a>
    )
}


export default InstantImageUpload