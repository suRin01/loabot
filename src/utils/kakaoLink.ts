import { stringify } from "querystring";
import { chatData, chatroomData, Cookie, kalinkReqData } from "../types/messageTemplate";
import { axiosWrapper } from "./axiosWrapper";
import { cookieParser } from "./utils";
import * as fs from 'node:fs/promises';
import Cheerio from "cheerio";
import NodeBuffer from 'buffer';

export const sendKakaoLink = async <T>(appKey: string, templateId: number, templateArgs: T, chatName:string): Promise<boolean>=>{
    const cookiesString = await fs.readFile(__dirname+'/../auth/cookie.txt');
    const cookieJar = JSON.parse(cookiesString.toString()) as Cookie[];
    const cookie = cookieJar.map((cookie)=>{
        return `${cookie.name}=${cookie.value};`
    }).join("")


    const kalinkCustomTemplate = {
        "link_ver": "4.0",
        "template_id": templateId,
        "template_args": templateArgs,
    }
    const baseURL = 'https://sharer.kakao.com';

    let data = stringify({
        'app_key': appKey,
        'ka': 'sdk/2.2.0 os/javascript sdk_type/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Flocalhost%3A3001',
        'validation_action': 'custom',
        'validation_params':  JSON.stringify(kalinkCustomTemplate)
        });
    //GET redirct url
    const redirectResponse = await axiosWrapper("POST", baseURL + '/picker/link', cookie, data);

    let parsedRawHeader: Record<string, string> = {};
    const rawHeader = redirectResponse.request.res.rawHeaders as string[];
    rawHeader.forEach((value:string, index:number)=>{
        if(index % 2 === 0){
            parsedRawHeader[value] = '';
        }else{
            parsedRawHeader[rawHeader[index-1]] = value;
        }
    })

    //GET CSRF token and Chatroom list
    const csrfandChatResponse = await axiosWrapper("GET", baseURL + parsedRawHeader["Location"], cookie);
    let parsedCsrfRawHeader: Record<string, string> = {};

    const csrfRawHeader = csrfandChatResponse.request.res.rawHeaders as string[];
    csrfRawHeader.forEach((value:string, index:number)=>{
        if(index % 2 === 0){
            parsedCsrfRawHeader[value] = '';
        }else{
            parsedCsrfRawHeader[csrfRawHeader[index-1]] = value;
        }
    })

    
    //CSRF TOKEN
    let parsedCookie:{_csrf?: string} = {};
    if(parsedCsrfRawHeader["Location"] !== undefined && parsedCsrfRawHeader["Location"].startsWith("https://accounts.kakao.com/login")){
        if(parsedCsrfRawHeader["set-cookie"]){
            parsedCookie = cookieParser(parsedCsrfRawHeader["set-cookie"])
        }else{
            console.log("check kakao cookie");
            return false;
        }
    }
    if(csrfandChatResponse.headers !== undefined && csrfandChatResponse.headers["set-cookie"] !== undefined){
        parsedCookie = cookieParser(csrfandChatResponse.headers["set-cookie"][0])
    }
    
    
    //CHECK CSRF TOKEN is valid
    if (Object.getOwnPropertyNames(parsedCookie).findIndex((name)=>{ if(name === "_csrf") return true }) === -1) {
        console.log("no csrf token");
        return false;
    }
    //Chatroom Data
    try {
        const b64ChatList = Cheerio.load(csrfandChatResponse.data)('script').get()[1].children[0].data.split('"')[1].replaceAll('"', "").replaceAll(";", "").trim();
        const chatList = JSON.parse(NodeBuffer.Buffer.from(b64ChatList, 'base64').toString('utf8')) as chatData;
        

        //make kakaolink data
        const trgtChat = (chatList.data.chats as chatroomData[]).find((chat)=>{
            if(chat.title === chatName) return true;
        })
        if(trgtChat === undefined){
            console.log(`no chatroom named ${chatName}`)
            return false;
        }

        const finishRequest: kalinkReqData = {
            app_key: chatList.data.appKey,
            short_key: chatList.data.shortKey,
            _csrf: chatList.data.csrfToken,
            checksum: chatList.data.checksum,
            receiver: NodeBuffer.Buffer.from(JSON.stringify(trgtChat)).toString('base64')
        }
        
        await axiosWrapper("POST", baseURL + '/picker/send', `${cookie}_csrf=${parsedCookie["_csrf"]}`, stringify(finishRequest));
        return true;
    } catch (error) {
        return false;
    }
    
}