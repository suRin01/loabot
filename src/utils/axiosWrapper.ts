import axios, { AxiosResponse } from "axios"

export const axiosWrapper = (method: "POST" | "GET", url:string, cookie?:string, data?: string): Promise<AxiosResponse>=>{
    return new Promise((resolve, reject) => {
        const config ={
            method,
            url,
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Cookie': cookie
            },
            data,
            maxRedirects: 0
        }
        axios.request(config)
        .then((result)=>{
            resolve(result);
        })
        .catch((error)=>{
            if (error.response.status === 302) {
                resolve(error)
            }
            reject("error found")
        })
    })
}