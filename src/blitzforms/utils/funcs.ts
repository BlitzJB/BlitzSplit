import { env } from "~/env.mjs"


export interface ImgurResponse {
    /* Requires Imgur Setup */
    data: {
        id: string
        title: string
        description: string
        datetime: number
        type: string
        animated: boolean
        width: number
        height: number
        size: number
        views: number
        bandwidth: number
        vote: string
        favorite: boolean
        nsfw: string
        section: string
        account_url: string
        account_id: number
        is_ad: boolean
        in_most_viral: boolean
        has_sound: boolean
        tags: string[]
        ad_type: number
        ad_url: string
        edited: string
        in_gallery: boolean
        deletehash: string
        name: string
        link: string
    }
    success: boolean
    status: number
}

export async function uploadImage(image: string) {
    /* Requires Imgur Setup */
    const headers = new Headers()
    headers.append("Authorization", `Client-ID ${env.IMGUR_CLIENT_ID}`)

    const formdata = new FormData()
    formdata.append("image", image)

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
    }

    const response = await fetch("https://api.imgur.com/3/image", requestOptions)
    const result = await (response.json() as Promise<ImgurResponse>)
    return result
}