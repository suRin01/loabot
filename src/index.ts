import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { functionSwithcer } from './functions';
import KakaoLinkPlugin from './plugins/kakaoLink';
import 'dotenv/config'

const prefix = '+';
const server = new UDPServer({ serviceName: 'remote-kakao' });

server.usePlugin(LoggerPlugin, {
    logFilePath: path.join(process.cwd(), 'messages.log'),
    enableAppInfo: true,
});

const config = {
    email: process.env.kakao_id,
    password: process.env.kakao_password,
    key: process.env.kakao_dev_key,
    host: process.env.kakao_host
  };

server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.split(' ');
    const cmd = args.shift()?.slice(prefix.length);

    if (cmd === undefined) return;

    if  (cmd === 'kakaolink'){
        msg.replyKakaoLink({
            id: 94711, // KakaoTalk Message Template id
            args: { THU: 'https://img.lostark.co.kr/armory/1/B761700DC0B53A25EC6A0DA10BF6100AF9F4CE542F3F5984B50CD36E86E9322F.png?v=20230607141813', 
                header: '1대대당직사령' ,
                title: '1대대당직사령 타이틀' ,
                desc: '1대대당직사령 설명' 
            }, // KakaoTalk Message Template arguments
          });
    }

    const responseTexts = await functionSwithcer(cmd, args[0]);
    if(responseTexts !== undefined){
        const timestamp = Date.now();
        responseTexts.forEach(async (responseText)=>{
            await msg.replyText(responseText.body);
        })
        msg.replyText(`${Date.now() - timestamp}ms`);
    }
});

server.start(7050, undefined);

