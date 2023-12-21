//import { TCPServer } from "../src/service/tcpServer";
import { DatabaseConnection } from "../src/service/DatabaseConnection";
import { dbStuffSearch, getTodayExportaionIsland, persistMarketData } from "../src/utils/axiosLostarkApi";
import { KakaoSession } from "../src/utils/KakaoSession"
//import * as net from 'node:net'



const cookieTest = async ()=>{
    console.log("test script about kakao session");

    let session = new KakaoSession();
    await session.init();

    //session.setKakaoSession("soullog77@naver.com", "silverlistic97!");
    await session.checkCurrentCookie();


    //session.desctruct();
    return;
}

const expeditionTest = async ()=>{
    console.log("test script start")

    console.log("testing prokion")

    const eventList = await getTodayExportaionIsland();
    let responseText = `오늘 모험섬\n\n`;
    eventList.forEach((event)=>{
        responseText += `${event.name}(${event.startTime.map(x => x.getHours()).join("시, ")}시): ${event.reward}\n`
    })

    console.log(responseText)
}

const persistMarketDataTest = async ()=>{
    console.log("item scrap start");
    await persistMarketData(90000, null, null, "test");
    await persistMarketData(70000, null, null, "test");
    await persistMarketData(60000, null, null, "test");
    await persistMarketData(50000, null, null, "test");
    await persistMarketData(40000, '전설', null, "test");
    
    [90000, 70000, 60000, 50000, 40000].forEach(async (cat)=>{
        const dbData = await dbStuffSearch(cat);
        console.log(`category ${cat}: saved ${dbData.length} items.`);
    })

}

const deleteTestData = async ()=>{
    console.log("clean up test data");
    await DatabaseConnection.getInstance().stuff_price.deleteMany({
        where:{
            input_id:{
                equals: "test"
            }
        }
    })
}


const lookupPrevious1HourData = async ()=>{
    let nowDate = new Date();
    nowDate.setHours(nowDate.getHours() - nowDate.getTimezoneOffset()/60);
    nowDate.setMinutes(0, 0, 0);
    const endDate = new Date(nowDate)
    endDate.setHours(endDate.getHours() + 1);

    const dbData = await DatabaseConnection.getInstance().stuff_price.findMany({
        where:{
            input_dt: {
               gte: nowDate,
               lt: endDate,
            },
            input_id: {
                equals: "test"
            }
        }
    })

    console.log(`lookup test data count: ${dbData.length}`);
}






(async ()=>{
    const startKey = process.argv[2];
    if(startKey !== undefined){
        switch (startKey) {
            case "cookie":
                await cookieTest()
                break;
        
            case "exp":
                await expeditionTest()
                
            break;

            case "market":
                await persistMarketDataTest();
                await lookupPrevious1HourData();
                await deleteTestData();
            break;
        
            default:
                await cookieTest()
                await expeditionTest()
                await persistMarketDataTest()
                await deleteTestData();
                break;
        }

    }
})();
