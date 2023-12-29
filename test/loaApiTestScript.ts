//import { TCPServer } from "../src/service/tcpServer";
import { DatabaseConnection } from "../src/service/DatabaseConnection";
import { CharacterInfo, Equipment } from "../src/types/loaApi";
import { dbStuffSearch, getCharacterData, getTodayExportaionIsland, persistMarketData } from "../src/utils/axiosLostarkApi";
import { KakaoSession } from "../src/utils/KakaoSession"
import {AccessoryTooltip} from "../src/types/loaApiEquipTooltips"
import axios from "axios";
import { merchantTimeIndex } from "../src/utils/utils";
import { korlarkResponse } from "../src/types/kloaApi";

const merchantTest = async (command: string = "아만") => {
    let targetServer: number | undefined = undefined;
    let timeset = merchantTimeIndex((new Date()).getHours());
    console.log(`timeset: ${timeset}`)
    const value = command;
    if (typeof value !== 'string') {
        targetServer = 3
    } else {
        switch (value) {
            case "루페온":
                targetServer = 1;
                break;
            case "실리안":
                targetServer = 2;
                break;
            case "아만":
                targetServer = 3;
                break;
            case "아브렐슈드":
                targetServer = 4;
                break;
            case "카단":
                targetServer = 5;
                break;
            case "카마인":
                targetServer = 6;
                break;
            case "카제로스":
                targetServer = 7;
                break;
            case "니나브":
                targetServer = 8;
                break;
            default:
                targetServer = undefined;
        }
    }
    let reusltText = `${value} 서버의 떠상 목록입니다.\n`;

    if (timeset === 1) {
        reusltText += "떠상 시간: 오전 4:00 ~ 오전 9:30\n\n";

    } else if (timeset === 2) {
        reusltText += "떠상 시간: 오전 10:00 ~ 오후 3:30\n\n";

    } else if (timeset === 3) {
        reusltText += "떠상 시간: 오후 4:00 ~ 오후 9:30\n\n";

    } else if (timeset === 4) {
        reusltText += "떠상 시간: 오후 10:00 ~ 오전 3:30\n\n";
    }



    const korlarkResult = await axios
        .get<korlarkResponse>(`https://api.korlark.com/merchants?limit=15&server=${targetServer}`);

    let isMerchantAvailablel = false;

    korlarkResult.data.merchants.forEach((row) => {
        console.log(merchantTimeIndex((new Date(row.created_at).getHours() + 9)%24))
        if (timeset === merchantTimeIndex(((new Date(Date.parse(row.created_at))).getHours() + 9) % 24)) {
            isMerchantAvailablel = true;
            reusltText += "-" + row.continent + "-\n " + row.items.map((item) => {
                if (item.type === 0) {
                    return item.content + ' 카드';
                } else if (item.type === 1) {
                    if (item.content === "0") {
                        return "영웅 호감도";
                    } else if (item.content === "1") {
                        return "전설 호감도";
                    }
                } else if (item.type === 2) {
                    return item.content;
                }
                return;

            }).join(", ") + "\n"
        }
    });
    console.log(!isMerchantAvailablel)
    if (!isMerchantAvailablel) {
        return [{
            "type": "text",
            "body": "kloa에 보고된 떠상이 없습니다."
        }];
    }
    console.log(reusltText)
    return [{
        "type": "text",
        "body": reusltText
    }];
}

const accessoryTest = async (value:string = "1대대당직사령")=>{
    let responseText = `${value}님의 악세서리 정보입니다.\n`
    const info: CharacterInfo = await getCharacterData(value);

    const access:Equipment[] = info.ArmoryEquipment.filter(element=>["목걸이", "귀걸이", "반지"].find(trgarr => trgarr === element.Type))
    access.forEach(equip=>{
        JSON.parse(equip.Tooltip) as AccessoryTooltip;
        responseText += `${equip.Type}: (${equip.Grade})${equip.Name} 품질 ${JSON.parse(equip.Tooltip)["Element_001"]["value"]["qualityValue"]}\n`;
        
        const content = JSON.stringify(JSON.parse(equip.Tooltip)["Element_006"]["value"]["Element_000"]["contentStr"]);
        const matches = content.matchAll(/\[<FONT COLOR='\#.{6}'>(.{1,10})<\/FONT>] 활성도 \+(.)<BR>"/gm);
        for(const match of matches){
            responseText += `    ${match[1]} + ${match[2]} \n`
        }

    })
    console.log(responseText);

}

const cookieTest = async ()=>{
    console.log("test script about kakao session");

    let session = new KakaoSession();
    await session.init();

    //session.setKakaoSession("soullog77@naver.com", "silverlistic97!");
    await session.checkCurrentCookie();


    //session.desctruct();
    return;
}

const cookieRenew = async ()=>{
    console.log("renew kakao session");
    const session = new KakaoSession();
    await session.init();

    const isLogin = await session.checkCurrentCookie();
    console.log(`${isLogin} returned.`);
    if(isLogin){
        console.log("logged in.")
    }else{
        console.log("session expired.")
        console.log("trying renew session with previous login data");
        if(await session.loginWithPreviousSession()){
            return;
        }
        
        console.log("session has gone. log in with id/pw");
        await session.setKakaoSession(process.env['kakao_id'] as string, process.env['kakao_password'] as string);
    }
    await session.desctruct();
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


const dirTest = ()=>{
    console.log(process.env["INIT_CWD"]);
}



(async ()=>{
    const startKey = process.argv[2];
    if(startKey !== undefined){
        switch (startKey) {
            case "cookie":
                await cookieTest()
                break;
        
            case "renew":
                await cookieRenew()
                break;
            case "exp":
                await expeditionTest()
                
            break;

            case "market":
                await persistMarketDataTest();
                await lookupPrevious1HourData();
                await deleteTestData();
            break;
            case "dir":
                dirTest()
            break;
            case "acc":
                accessoryTest()
            break;
            case "mer":
                merchantTest()
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
