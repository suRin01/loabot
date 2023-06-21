import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { functionSwithcer } from './functions';
import 'dotenv/config'
import { sendKakaoLink } from './utils/kakaoLink';
const prefix = '+';


const cookie: string = '_T_ANO=BcpyXUE5Frae3uKEE9bHQdC+klEKuQD6o7teQbKIyKZg7UzYpZw06w+OjGT6Tl5iG2d8kZx7B6KOvddlrq4a4tP5r1VsUXCiTWbtRFF6LRsSjerFLzVHwZOFY7SMnS1ht8NOucZiNUc+kY9/WmGI/ysZxIhty1fbiMzQFYOd/LIkFLVZ+3dL2hcXYlIMdp97EHe0DJ7p1SWA0T13vdTGX5cd0ZVT/Jcp1CWgRyEPlPfX4QdmU/9rkoKdqTYjP3wmOmfx8vCsVgHqEGSdU0BzyWTSXDjBwtLTYvzOymi35DsdYQY0DlocX35G4uF60lYZTgvOeaf/4H0vi0rLYNL31g==; _ga=GA1.2.1445519010.1686212911; _gat=1; _gid=GA1.2.1613608606.1687132576; _kahai=e09e68a95008a493607f50d20817f5c0f35c883ea2fb5d161c641eac442fab90; _karb=k2U_bEusFMhuHl7F_1686212947399; _karmt=tVssBPYgaiRr9KmocVmTdNbJ85EFmmdzqnZb93iwK_L1M5tWq7A_qlySwKCjd81I; _karmtea=1687398023; _kawlt=TR4S4uQ1Kubr-mH-J1r-gx2Ndw09OTMsW1DseVjt_uKnCTiXhpjJpAmahY7MP6mylewq77X49D63ZfX5pHw_lyXTZn5F1iRysTRlQpAqLvZykujNxgqNcnVLkwl6E8ZH; _kawltea=1687387223; _kdt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZlbG9wZXJfaWQiOjMzNDUzODEsInRva2VuIjoiZGY1M2RmZjk0MjE3NWYwYmQ0YmU3NTRhOWI0ODk3YzIyNGFmMTQ3YmViOTdjZjBhMDU4MzQ3NTlkNzRjZTNkYSJ9.PQZMKvwT5WtTDHddfStrq8ZIXbBxIktmR_wZx3Sa8ug; kd_lang=ko;';
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
            const kalinkResult = await sendKakaoLink(cookie, appKey, templateId, responseText.kalinkData, msg.room.name);
            if(!kalinkResult){
                msg.replyText("카링 전송 실패");
            }
        }
    })
    msg.replyText(`${Date.now() - timestamp}ms`);



    
});

server.start(7050, undefined);

