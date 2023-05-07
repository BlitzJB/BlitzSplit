import { uploadImage } from "../utils/funcs"
import { NextApiRequest, NextApiResponse } from "next"

/* Requires Imgur Setup */

export const imageUploadConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' 
        }
    }
}


export async function imageUploadHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.status(200).json(await uploadImage(req.body.image))
    } catch (error) {
        res.status(500).json(error)
    }
}