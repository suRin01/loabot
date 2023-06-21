import { battleItemRecipeList, category, msgStrings } from "./constants/strings";
import { characterInfo } from "./types/loaApi";
import { kalinkCharacterData, messageTemplate } from "./types/messageTemplate";
import { dbStuffSearch, getCharacterData, getMarkeFullPagetData, getMarketData, getTodayExportaionIsland, getUserSubCharacter, getWeeklyAbyssDungeouns, getWeeklyAbyssGuardians, itemCraftPrinceing, persistMarketData } from "./utils/axiosLostarkApi";
import { sendKakaoLink } from "./utils/kakaoLink";
import { argCheck, argNumCheck, riceCalculator, setStringLength } from "./utils/utils";

export const functionSwithcer = async (msg: string, arg: string | undefined = undefined): Promise<messageTemplate[] | undefined> => {
    switch (msg) {
        case '명령어': {
            return [{
                "type": "text",
                "body": "+프로키온\n+도가토\n+도비스\n+ㅂㅂㄱ\n+부캐 _캐릭터명_\n+배탬\n+특수\n+음식\n+재료",
            }]
        }
        case '프로키온': {
            const eventList = await getTodayExportaionIsland();
            let responseText = `오늘 모험섬\n\n`;
            eventList.forEach((event)=>{
                responseText += `${event.name}(${event.startTime.map(x => x.getHours()).join("시, ")}시): ${event.reward}\n`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '랜전카': {

            break;
        }
        case '도가토': {
            const eventList = await getWeeklyAbyssGuardians();
            let responseText = `이번주 도가토\n`;
            eventList.forEach((event)=>{
                responseText += `\n${event}`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '도비스': {
            const eventList = await getWeeklyAbyssDungeouns();
            let responseText = `이번주 도비스\n\n${eventList.title}`;
            eventList.areaList.forEach((event)=>{
                responseText += `\n${event}`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '각인서': {
            const engravementList = await dbStuffSearch(category.engravement);
            let responseText = `각인서 가격\n`;
            engravementList.forEach((engravement)=>{
                responseText += `\n${engravement.name}: ${engravement.current_price}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '쌀값': {

            break;
        }
        case '재료': {
           const value = await dbStuffSearch(category.ingreItem);
           let responseText = `오늘의 제작 재료 가격\n`;
           value.forEach((item)=>{
                responseText += `\n${item.name}(${item.bundleCount}개): ${item.current_price}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '재료저장': {
            await persistMarketData(90000);
            await persistMarketData(70000);
            await persistMarketData(60000);
            await persistMarketData(50000);
            await persistMarketData(40000, '전설');
            return [{
                "type": "text",
                "body": "ok",
            },]
        }
        case '배탬': {
            const value = await itemCraftPrinceing(category.battleItem);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item.name}\n - 경매장가: ${item.marketPrice}골드, 개당 제작가: ${item.craftCost}골드, 개당 이득: ${item.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '음식': {
            const value = await itemCraftPrinceing(category.food);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item.name}\n - 경매장가: ${item.marketPrice}골드, 개당 제작가: ${item.craftCost}골드, 개당 이득: ${item.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '특수': {
            const value = await itemCraftPrinceing(category.enforceItem);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item.name}\n - 경매장가: ${item.marketPrice}골드, 개당 제작가: ${item.craftCost}골드, 개당 이득: ${item.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '아바타': {

            break;
        }
        case '정보': {
            const value = argCheck(arg, msgStrings.generalArgError);
            console.log(`start lookup ${arg} sibilings`)
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            const info: characterInfo = await getCharacterData(value);
            if(info === null){
                return [{
                    "type": "text",
                    "body": "캐릭터 정보가 없습니다.",
                },]
            }
        
            const header        = `${info.ArmoryProfile.CharacterName}님의 캐릭터 정보`;
            const title         = `${info.ArmoryProfile.CharacterClassName} / ${info.ArmoryProfile.ExpeditionLevel} / ${info.ArmoryProfile.TotalSkillPoint}`;

            const thumnail      = info.ArmoryProfile.CharacterImage === null ? "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb77pWc%2Fbtr9Ox1B2fy%2F7XrjsZ2fc3tBI4s4U3WN1K%2Fimg.png" : info.ArmoryProfile.CharacterImage ;
            const summary       = `${info.ArmoryProfile.ItemMaxLevel} / ${info.ArmoryEquipment === null ? "장비없음" : info.ArmoryEquipment[0].Name}`;
            const statList      = info.ArmoryProfile.Stats === null ? "만들어만 둔 캐릭" : info.ArmoryProfile.Stats.filter(x=> ["치명", "특화", "신속"].includes(x.Type)).map(stat => `${stat.Type}: ${stat.Value}`).join(", ");

            const summary_desc  = `레벨 / 무강`;
            const summary_thu   = `https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcaOUT2%2Fbtr5BMWV9S8%2F8W7XK23Jti8G5kzy3ZPlv1%2Fimg.png`;
            
            const envList       = info.ArmoryEngraving === null ? "각인없음" : info.ArmoryEngraving.Effects.map(engrave => engrave.Name).join(", ");
            const gemList       = info.ArmoryGem === null ? "보석없음" : info.ArmoryGem.Gems.map( gem=> gem.Level ).join(", ");
            const tripodList    = info.ArmorySkills === null ? "스킬미장착" : info.ArmorySkills.filter(skill => skill.Level > 1).map(skill => skill.Tripods.filter(tripod => tripod.Level > 1)).flatMap(x => x).map(tripod=> tripod.Level).join(", ");
            const description   = info.ArmoryCard === null ? "카드 미장착" : `${info.ArmoryCard.Effects[0].Items[info.ArmoryCard.Effects[0].Items.length-1].Name}: ${info.ArmoryCard.Effects[0].Items[info.ArmoryCard.Effects[0].Items.length-1].Description}`;

            const templateArgs: kalinkCharacterData = {
                thumnail,
                header,
                summary,
                summary_desc,
                summary_thu,
                envList,
                gemList,
                tripodList,
                statList,
                title,
                description,
            };
            return [{
                "type": "kalink",
                "body": "kalink",
                kalinkData: templateArgs
            },]
            break;
        }
        case '장비': {

            break;
        }
        case '스킬': {

            break;
        }
        case '보석': {

            break;
        }
        case '부캐': {
            const value = argCheck(arg, msgStrings.generalArgError);
            console.log(`start lookup ${arg} sibilings`)
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            const sibilingList = await getUserSubCharacter(arg as string);

            if(sibilingList === undefined){
                return [{
                    "type": "text",
                    "body": msgStrings.charactorNotFound
                }] 
            }
            let reusltText = `${arg}님의 부캐 목록입니다.\n`;
            sibilingList.forEach((server)=>{
                reusltText = reusltText + `\n\n@${server.serverName}\n`
                server.characterList.forEach((characterInfo)=>{
                    reusltText = reusltText + `${characterInfo.classname} ${characterInfo.name} - Lv.${characterInfo.level}\n`;
                })
            })


            return [{
                "type": "text",
                "body": reusltText
            }];
        }
        case '주급': {
            const value = argCheck(arg, msgStrings.generalArgError);
            if (typeof value !== 'string') {
                return value;
            }

            break;
        }
        case 'ㅂㅂㄱ': {
            const value = argNumCheck(arg, msgStrings.generalArgError);
            if (typeof value !== 'number') {
                return value;
            }
            return riceCalculator(value);
        }
        case '경매장': {

            break;
        }
    }

}
