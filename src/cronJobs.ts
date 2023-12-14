import { scheduleJob } from 'node-schedule';
//import { persistMarketData } from './utils/axiosLostarkApi';
import 'dotenv/config'
import { KakaoSession } from './utils/KakaoSession';

/*
scheduleJob("stuffApiCrawl", '0 15 * * *', async ()=>{
    console.log((new Date()).toLocaleString())
    console.log("item scrap start");
    await persistMarketData(90000);
    await persistMarketData(70000);
    await persistMarketData(60000);
    await persistMarketData(50000);
    await persistMarketData(40000, '전설');
})
*/


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

