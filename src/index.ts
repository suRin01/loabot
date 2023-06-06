import { UDPServer } from '@remote-kakao/core'
import LoggerPlugin from './plugins/logger';
import path from 'node:path';
import { scheduleJob } from 'node-schedule';
import { persistMarketData } from './utils/axiosLostarkApi';
import { functionSwithcer } from './functions';

scheduleJob("stuffApiCrawl", '0 1 * * *', async ()=>{
    await persistMarketData(90000);
})


const prefix = '+';
const server = new UDPServer({ serviceName: 'remote-kakao' });

server.usePlugin(LoggerPlugin, {
    logFilePath: path.join(process.cwd(), 'messages.log'),
    enableAppInfo: true,
});

server.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.split(' ');
    const cmd = args.shift()?.slice(prefix.length);

    if (cmd === undefined) return;

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

