#!/usr/bin/env -S ts-node
import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { functionSwithcer } from './functions';
import 'dotenv/config'
import { sendKakaoLink } from './utils/kakaoLink';
import { kalinkCharacterData } from './types/messageTemplate';
import { RoomCacher } from './service/roomCaching';

//const cookie: string = '';
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
    //개발자전용 기능        b4ff6c12b7a8edf0c3ae28a7857f1cabbfb8fa17854fe6f0089499cb2acc95c7
    if (msg.sender.hash === 'b4ff6c12b7a8edf0c3ae28a7857f1cabbfb8fa17854fe6f0089499cb2acc95c7') {
        if (cmd === '++전체공지') {
            roomCache.getAllRoom().forEach(room=>{
                console.log(`${room.room.name}에 전체 공지를 전송합니다.`);
                console.log(args.join(" "));
                server.sendText(msg.address, msg.app.userId, msg.app.packageName, room.room.id, args.join(" "));
            })
            return;
        }
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

