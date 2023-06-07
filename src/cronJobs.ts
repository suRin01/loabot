import { scheduleJob } from 'node-schedule';
import { persistMarketData } from './utils/axiosLostarkApi';


scheduleJob("stuffApiCrawl", '0 1 * * *', async ()=>{
    await persistMarketData(90000);
    await persistMarketData(70000);
    await persistMarketData(60000);
    await persistMarketData(50000, null, "현자의 가루");
})


scheduleJob("stuffApiCrawl", '* * * * *', async ()=>{
    console.log("every minute execute this code");
})