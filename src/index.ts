#!/usr/bin/env -S ts-node
import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { functionSwithcer } from './functions';
import 'dotenv/config'
import { sendKakaoLink } from './utils/kakaoLink';
import { kalinkCharacterData } from './types/messageTemplate';
import { RoomCacher } from './service/roomCaching';
import { persistMarketData } from './utils/axiosLostarkApi';
import { scheduleJob } from 'node-schedule';
import { KakaoSession } from './utils/KakaoSession';

//initalizing scheduling
console.log("start cron jobs");
scheduleJob("stuffApiCrawl", '0 * * * *', async ()=>{
    console.log((new Date()).toLocaleString())
    console.log("item scrap start");
    await persistMarketData(90000);
    await persistMarketData(70000);
    await persistMarketData(60000);
    await persistMarketData(50000);
    await persistMarketData(40000, '전설');
})

scheduleJob("kakaoSession", '*/10 * * * *', async ()=>{
    console.log((new Date()).toLocaleString())
    console.log("renew kakao session");
    const session = new KakaoSession();
    await session.init();

    let isLogin = await session.checkCurrentCookie();
    if(isLogin){
        console.log("logged in.")
    }else{
        console.log("session expired.")
        await session.setKakaoSession(process.env['kakao_id'] as string, process.env['kakao_password'] as string);
    }
    await session.desctruct();

    return;

})





//const cookie: string = '';
console.log("start api server");
const appKey: string = '66dd278aa59de80b4f87c6123a0e51c1';
const templateId: number = 94749;

const server = new UDPServer();
let roomCache:RoomCacher = new RoomCacher();

server.usePlugin(LoggerPlugin, {
    logFilePath: path.join(process.cwd(), 'messages.log'),
    enableAppInfo: true,
});

server.on('message', async (msg) => {
    roomCache.insertRoom(msg);

    //disabling function in kakaotalk bot community chatroom
    if (msg.room.id === '18397704344550318') {
        if (msg.sender.hash !== 'f0908ef11700b68f37989c93559aaa6446e7c9313e385d89a705796282728787') {
            return;
        }
    }


    const args = msg.content.split(' ');
    const cmd = args.shift();
    if (cmd === undefined) {
        return;
    }
    try {
        const responseTexts = await functionSwithcer(cmd, ...args);
        if (responseTexts === undefined) return;

        responseTexts.forEach(async (responseText) => {
            if (responseText.type === 'text') {
                await msg.replyText(responseText.body);
            } else if (responseText.type === 'kalink') {
                if (responseText.kalinkData === undefined) return;
                const kalinkResult = await sendKakaoLink<kalinkCharacterData>(appKey, templateId, responseText.kalinkData, msg.room.name);
                if (!kalinkResult) {

                    msg.replyText(`${responseText.kalinkData.header}\n${responseText.kalinkData.summary}\n${"\u200b".repeat(500)}\n${responseText.kalinkData.thumnail}\n${responseText.kalinkData.title}\n\n각인: ${responseText.kalinkData.envList} \n\n보석: ${responseText.kalinkData.gemList} \n\n트라이포드: ${responseText.kalinkData.tripodList} \n\n치특신: ${responseText.kalinkData.statList} \n\n카드: ${responseText.kalinkData.description} `)
                    //msg.replyText("카링 전송 실패");
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
});

server.start(7050, undefined);

