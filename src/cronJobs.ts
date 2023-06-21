import { scheduleJob } from 'node-schedule';
import { persistMarketData } from './utils/axiosLostarkApi';


scheduleJob("stuffApiCrawl", '0 1 * * *', async ()=>{
    console.log((new Date()).toLocaleString())
    console.log("item scrap start");
    await persistMarketData(90000);
    await persistMarketData(70000);
    await persistMarketData(60000);
    await persistMarketData(50000);
    await persistMarketData(40000, '전설');
})
