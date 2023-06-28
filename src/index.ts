import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { functionSwithcer } from './functions';
import 'dotenv/config'
import { sendKakaoLink } from './utils/kakaoLink';
import { kalinkCharacterData } from './types/messageTemplate';
const prefix = '+';


const cookie: string = '_ga=GA1.2.1445519010.1686212911;_gat=1;_gid=GA1.2.1613608606.1687132576;_kahai=e09e68a95008a493607f50d20817f5c0f35c883ea2fb5d161c641eac442fab90;_karb=k2U_bEusFMhuHl7F_1686212947399;_karmt=UnR5H5HYznfnMHgeewAIV-gz5mo8fDNGnNd_icztoQ9HRYk0zEq1RYOVnmo7zwEL;_karmtea=1687480881;_kawlt=UrrMceb0ceRc0fAJ0Uyy7Hz7hEnAvpWddH6S8daQ8aZ3iW5HVWNWAWmoXeTNml292JLz_yeMXsEMy9bUGLkQKWOjY1ewUPzElh1tzk_2ThvJDUGiYlCz7coHikCRrxOr;_kawltea=1687470081;_kdt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZlbG9wZXJfaWQiOjMzNDUzODEsInRva2VuIjoiZGY1M2RmZjk0MjE3NWYwYmQ0YmU3NTRhOWI0ODk3YzIyNGFmMTQ3YmViOTdjZjBhMDU4MzQ3NTlkNzRjZTNkYSJ9.PQZMKvwT5WtTDHddfStrq8ZIXbBxIktmR_wZx3Sa8ug;_T_ANO=Z1ER2YRw0IkrYccFfuysDDQf8vadkrWLeAqmndFhxQD4ndSxVvZ1IR/ld+CoPfy544Rwg0+Sl6NzT76DYeFEw2mMhTj+K9TsJxyaQqSGhL4s9qu+gMhAqL/EdppvyZ+Yk7mKEhwWoKrVPEFjeV1mADyCYq5LbuRTzlaChYQEHOyizIQZirMmtLPYsRixR4om/sFFCTstTRh9ssQ0f8tWrddGPUz3maL5sVBcsdHiW4ZxQekaT4DrgHCBwkzrEzhaoFGsrX/tSHGHVIs0eZy0br/ySY+xsUwbRNztxK3gGB6egmVYirTk47WivbECwdL1/Le5xdTTv4P+lUuv0P9H1g==;kd_lang=ko;';
//const cookie: string = '';
const appKey: string = '66dd278aa59de80b4f87c6123a0e51c1';
const templateId: number = 94749;


const server = new UDPServer();

server.usePlugin(LoggerPlugin, {
    logFilePath: path.join(process.cwd(), 'messages.log'),
    enableAppInfo: true,
});


server.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.split(' ');
    const cmd = args.shift()?.slice(prefix.length);

    if(cmd === undefined) return;

    if(cmd === 'kakaolink'){
        console.log("kakao link test");
        return;
    }

    const responseTexts = await functionSwithcer(cmd, args[0]);
    if(responseTexts === undefined) return;
    
    const timestamp = Date.now();
    responseTexts.forEach(async (responseText)=>{
        if(responseText.type === 'text'){
            await msg.replyText(responseText.body);
        }else if(responseText.type === 'kalink'){
            if(responseText.kalinkData === undefined) return;
            const kalinkResult = await sendKakaoLink<kalinkCharacterData>(cookie, appKey, templateId, responseText.kalinkData, msg.room.name);
            if(!kalinkResult){
                msg.replyText("카링 전송 실패");
            }
        }
    })
    msg.replyText(`${Date.now() - timestamp}ms`);



    
});

server.start(7050, undefined);

