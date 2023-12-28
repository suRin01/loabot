import { stuff_price } from "@prisma/client";
import { category, msgStrings } from "./constants/strings";
import { CharacterInfo, Equipment } from "./types/loaApi";
import { kalinkCharacterData, messageTemplate } from "./types/messageTemplate";
import { dbStuffSearch, getAuctionData, getCharacterData, getTodayExportaionIsland, getUserSubCharacter, getWeeklyAbyssDungeouns, getWeeklyAbyssGuardians, itemCraftPrinceing, persistMarketData } from "./utils/axiosLostarkApi";
import { argCheck, argNumCheck, merchantTimeIndex, riceCalculator, weeklyProfitCalc } from "./utils/utils";
import axios from "axios";
import { korlarkResponse } from "./types/kloaApi";
import { AccessoryTooltip, IndentStringGroup, ItemPartBox, TooltipHeader } from "./types/loaApiEquipTooltips";

export const functionSwithcer = async (msg: string, ...arg: string[]): Promise<messageTemplate[] | undefined> => {
    switch (msg) {
        //just for Fun
        case '아': {
            if(Math.random()>0.9){
                if(arg[0] === undefined){
                    return [{
                        "type": "text",
                        "body": "메리카노",
                    }]
                }
            }
            break;
        }


        //just for Fun end
        case '명령어': {
            if(arg.length !== 0) return;
            return [{
                "type": "text",
                "body": "프로키온\n도가토\n도비스\nㅂㅂㄱ\n정보 _캐릭터명_\n부캐 _캐릭터명_\n배템\n특수\n음식\n재료\n경매장\n전각\n주급 _캐릭터명_\n장비 _캐릭터명_",
            }]
        }
        case '프로키온': {
            if(arg.length !== 0) return;
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
        case '도가토': {
            if(arg.length !== 0) return;
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
            if(arg.length !== 0) return;
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
        case '전각': {
            const engravementList = await dbStuffSearch(category.engravement, arg[0]);
            let responseText = `전각 가격\n`;
            engravementList.forEach((engravement:stuff_price)=>{
                responseText += `\n${engravement.name}: ${engravement.current_price}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '재료': {
            if(arg.length !== 0) return;
           const value = await dbStuffSearch(category.ingreItem);
           let responseText = `오늘의 제작 재료 가격\n`;
           value.forEach((item:stuff_price)=>{
                responseText += `\n${item.name}(${item.bundleCount}개): ${item.current_price}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '++재료저장': {
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
        case '배템': {
            if(arg.length !== 0) return;
            const value = await itemCraftPrinceing(category.battleItem);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item?.name}\n - 경매장가: ${item?.marketPrice}골드, 개당 제작가: ${item?.craftCost}골드, 개당 이득: ${item?.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '음식': {
            if(arg.length !== 0) return;
            const value = await itemCraftPrinceing(category.food);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item?.name}\n - 경매장가: ${item?.marketPrice}골드, 개당 제작가: ${item?.craftCost}골드, 개당 이득: ${item?.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '특수': {
            if(arg.length !== 0) return;
            const value = await itemCraftPrinceing(category.enforceItem);
            let responseText = `오늘의 가격\n`;
            value.forEach((item)=>{
                responseText += `\n${item?.name}\n - 경매장가: ${item?.marketPrice}골드, 개당 제작가: ${item?.craftCost}골드, 개당 이득: ${item?.profit}골드`
            })
            return [{
                "type": "text",
                "body": responseText,
            },]
        }
        case '아바타': {

            break;
        }
        case '장비': {
            if(arg.length !== 1) return;

            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            let responseText = `${value}님의 장비 정보입니다.\n`
            const info: CharacterInfo = await getCharacterData(value);
            info.ArmoryEquipment.slice(0, 6).forEach((equip)=>{
                const tooltips = JSON.parse(equip.Tooltip) as Record<string, Object>;
                const elementNames = Object.getOwnPropertyNames(tooltips);
                //remove unused things from array
                const itemFooter = elementNames.splice(-6);
                

                let header:Record<string, Object> = {}
                elementNames.splice(0, 7).forEach((key)=>{
                    let value = tooltips[key];
                    if(value !== undefined) header[key] = value;
                });
                let itemDescription = "";
                const FullHeader = header as TooltipHeader;
                //아이템명
                if(FullHeader.Element_000?.value !== undefined){
                    const itemNameExtractor = /\<.*\>\<.*\>(.*)\<\/.*\><\/.*\>/;
                    const extractResult = itemNameExtractor.exec(FullHeader.Element_000?.value)
                    extractResult !== null ? itemDescription += `${extractResult[1]}` : '아이템 미장착';
                    
                }else{
                    return;
                }
                //아이템 랩
                if(FullHeader.Element_001?.value.leftStr2 !== undefined){
                    const itemLeveLExtractor = /\<.*\>.* ([0-9]{3,4}) .*\<\/.*\>/;
                    const extractResult = itemLeveLExtractor.exec(FullHeader.Element_001?.value.leftStr2)
                    extractResult !== null ? itemDescription += `\n(${extractResult[1]}레벨)` : '(레벨 미표기)';
                }
                //세트 랩
                let tooltipKey = itemFooter[0] + "";
                const setLevelParse = /.{2} <.*?>(.+?)<\/.*?>/.exec((tooltips[tooltipKey] as ItemPartBox).value.Element_001);
                if(setLevelParse !== null) itemDescription += ` (${setLevelParse[1]})`

                //품질
                if(FullHeader.Element_001?.value.qualityValue !== undefined){
                    itemDescription += ` 품질: ${FullHeader.Element_001?.value.qualityValue}`
                }
                
                //엘릭서, 엘릭서 활성화, 초월
                elementNames.forEach((key)=>{
                    const etcTooltips = tooltips[key] as IndentStringGroup;
                    if(etcTooltips.value["Element_000"]?.topStr !== undefined && etcTooltips.value["Element_000"]?.topStr.includes("초월")){
                        const targetStr = etcTooltips.value["Element_000"]?.topStr;
                        const imgRemovedStr = targetStr.replace(/<img.*<\/img>/gmi, "");
                        const activationCheck = /<font color='#(.{6})'>/i.exec(imgRemovedStr);
                        if(activationCheck === null) return;
                        if(activationCheck[1] === '787878') return;
                        const refinedStr = imgRemovedStr.replace(/<.*?>/ig, "").replace("[초월] ", "");
                        
                        itemDescription += `\n초월: ${refinedStr}`;
                    }else if(etcTooltips.value["Element_000"]?.topStr !== undefined && etcTooltips.value["Element_000"]?.topStr.includes("엘릭서")){
                        const etcKeyList = Object.getOwnPropertyNames(etcTooltips.value["Element_000"].contentStr);

                        etcKeyList.forEach((etcKey)=>{
                            const targetStr = etcTooltips.value["Element_000"]?.contentStr[etcKey]?.contentStr;
                            const imgRemovedStr = targetStr?.replace(/<img.*<\/img>/gmi, "");
                            if(imgRemovedStr === undefined) return;
                            const activationCheck = /<font color='#(.{6})'>/i.exec(imgRemovedStr);
                            if(activationCheck === null) return;
                            if(activationCheck[1] === '787878') return;
                            const refinedStr = imgRemovedStr.replace(/<.*?>/ig, "");
                            
                            itemDescription += `\n${refinedStr}`;
                        })
                    }
                    
                })
                
            responseText += `\n\n\n ${itemDescription}`
            })


            return [{
                "type": "text",
                "body": responseText,
            },]

            break;
        }
        case '악세': {

            if(arg.length !== 1) return;

            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            
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

            return [{
                "type": "text",
                "body": responseText,
            },]
            break;
        }
        
        case '초월': {
            if(arg.length !== 1) return;

            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            let responseText = `${value}님의 초월 정보입니다.\n`
            const info: CharacterInfo = await getCharacterData(value);
            info.ArmoryEquipment.slice(1, 6).forEach((equip)=>{
                const tooltips = JSON.parse(equip.Tooltip) as Record<string, Object>;
                const elementNames = Object.getOwnPropertyNames(tooltips);                

                let header:Record<string, Object> = {}
                elementNames.splice(0, 7).forEach((key)=>{
                    let value = tooltips[key];
                    if(value !== undefined) header[key] = value;
                });
                let itemDescription = "";
                const FullHeader = header as TooltipHeader;
                //아이템명
                if(FullHeader.Element_000?.value !== undefined){
                    const itemNameExtractor = /\<.*\>\<.*\>(.*)\<\/.*\><\/.*\>/;
                    const extractResult = itemNameExtractor.exec(FullHeader.Element_000?.value)
                    if(extractResult === null){
                        return;
                    }
                    const equipmentName = extractResult[1] + "";
                    switch (true) {
                        case equipmentName.includes("머리") || equipmentName.includes("투구") || equipmentName.includes("모자"):
                            itemDescription += "머리: " 
                            break;
                    
                        case equipmentName.includes("견갑") || equipmentName.includes("어깨"):
                            itemDescription += "어깨: " 
                            break;
                        case equipmentName.includes("상의"):
                            itemDescription += "상의: " 
                            break;
                        case equipmentName.includes("하의"):
                            itemDescription += "하의: " 
                            break;
                        case equipmentName.includes("장갑"):
                            itemDescription += "장갑: " 
                            break;
                        default:
                            break;
                    } 

                }else{
                    return;
                }
                
                //엘릭서, 엘릭서 활성화, 초월
                elementNames.forEach((key)=>{
                    const etcTooltips = tooltips[key] as IndentStringGroup;
                    console.log(JSON.stringify(etcTooltips.value["Element_000"]));
                    if(etcTooltips.value["Element_000"]?.topStr !== undefined && etcTooltips.value["Element_000"]?.topStr.includes("초월")){
                        const targetStr = etcTooltips.value["Element_000"]?.topStr;
                        const imgRemovedStr = targetStr.replace(/<img.*<\/img>/gmi, "");
                        const activationCheck = /<font color='#(.{6})'>/i.exec(imgRemovedStr);
                        if(activationCheck === null) return;
                        if(activationCheck[1] === '787878') return;
                        const refinedStr = imgRemovedStr.replace(/<.*?>/ig, "").replace("[초월] ", "");
                        
                        itemDescription += `${refinedStr}`;
                    }
                    
                    
                })
                
            responseText += `\n ${itemDescription}`
            })


            return [{
                "type": "text",
                "body": responseText,
            },]
            break;
        }

        case '정보': {
            if(arg.length !== 1) return;
            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            const info: CharacterInfo = await getCharacterData(value);
            if(info === null){
                return [{
                    "type": "text",
                    "body": "캐릭터 정보가 없습니다.",
                },]
            }
        
            const header        = `${info.ArmoryProfile.CharacterName}님의 캐릭터 정보`;
            const title         = `${info.ArmoryProfile.CharacterClassName} / ${info.ArmoryProfile.ExpeditionLevel} / ${info.ArmoryProfile.TotalSkillPoint}`;

            const thumnail      = info.ArmoryProfile.CharacterImage === null ? "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb77pWc%2Fbtr9Ox1B2fy%2F7XrjsZ2fc3tBI4s4U3WN1K%2Fimg.png" : info.ArmoryProfile.CharacterImage ;
            const summary       = `${info.ArmoryProfile.ItemMaxLevel} / ${info.ArmoryEquipment === null ? "장비없음" : info.ArmoryEquipment[0]?.Name}`;
            const statList      = info.ArmoryProfile.Stats === null ? "만들어만 둔 캐릭" : info.ArmoryProfile.Stats.filter(x=> ["치명", "특화", "신속"].includes(x.Type)).map(stat => `${stat.Type}: ${stat.Value}`).join(", ");

            const summary_desc  = `레벨 / 무강`;
            const summary_thu   = `https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcaOUT2%2Fbtr5BMWV9S8%2F8W7XK23Jti8G5kzy3ZPlv1%2Fimg.png`;
            
            const envList       = info.ArmoryEngraving === null ? "각인없음" : info.ArmoryEngraving.Effects.map(engrave => engrave.Name).join(", ");
            const gemList       = info.ArmoryGem === null ? "-쌀-" : info.ArmoryGem.Gems.map( gem=> gem.Level ).join(", ");
            const tripodList    = info.ArmorySkills === null ? "스킬미장착" : info.ArmorySkills.filter(skill => skill.Level > 1).map(skill => skill.Tripods.filter(tripod => tripod.Level > 1)).flatMap(x => x).map(tripod=> tripod.Level).join(", ");
            const description   = info.ArmoryCard === null ? "카드 미장착" : `${info.ArmoryCard?.Effects[0]?.Items[info.ArmoryCard?.Effects[0]?.Items?.length-1]?.Name}: ${info.ArmoryCard.Effects[0]?.Items[info.ArmoryCard.Effects[0]?.Items?.length-1]?.Description}`;
            const link = `char/${info.ArmoryProfile.CharacterName}`
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
                link,
            };
            return [{
                "type": "kalink",
                "body": "kalink",
                kalinkData: templateArgs
            },]
            break;
        }
        case '부캐': {
            if(arg.length !== 1) return;
            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            const sibilingList = await getUserSubCharacter(arg[0] as string);

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
            if(arg.length !== 1) return;
            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                console.log(msgStrings.generalArgError);
                return value;
            }
            const sibilingList = await getUserSubCharacter(arg[0] as string);
            if(sibilingList === undefined){
                return [{
                    "type": "text",
                    "body": msgStrings.charactorNotFound
                }] 
            }

            return [{
                "type": "text",
                "body": value+"님의 상위 6캐릭터 주급입니다.\n\n"+sibilingList.map((server)=>{
                    const serverSum = server.characterList.sort((fore, back)=>{
                        if(fore.level > back.level){
                            return -1;
                        }else if(fore.level < back.level){
                            return 1;
                        }
                        return 0;
                    }).slice(0, 6).reduce((pre, cur)=>{
                        return pre + weeklyProfitCalc(Number.parseInt(String(cur.level).replace(",", "")))
                    }, 0)
                    return `${server.serverName}: ${serverSum} 골드`;
                }).join("\n")+"\n\n위의 내용은 하브4관, 카멘4관을 포함한 값입니다."
            }];

            break;
        }
        case 'ㅂㅂㄱ': {
            if(arg.length !== 1) return;
            const value = argNumCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'number') {
                return value;
            }
            return riceCalculator(value);
        }
        case '경매장': {
            const value = argCheck(arg.join(" ") === "" ? undefined : arg.join(" "), msgStrings.generalArgError);
            if (typeof value !== 'string') {
                return value;
            }
            const gemPrices = await getAuctionData(value, 210000, "BUY_PRICE");
            if(gemPrices.Items === null || gemPrices.Items.length === 0){
                return [{
                    "type": "text",
                    "body": "아이템 이름을 정확하게 입력해주세요. 3티어 보석만 검색가능합니다."
                }];
            }
            

            return [{
                "type": "text",
                "body": `${gemPrices.Items[0]?.Name}: ${gemPrices.Items[0]?.AuctionInfo.BuyPrice} 골드`
            }];


            break;
        }

        case '떠상':{
            let targetServer:number|undefined = undefined;
            let timeset = merchantTimeIndex((new Date()).getHours());

            const value = argCheck(arg[0], msgStrings.generalArgError);
            if (typeof value !== 'string') {
                targetServer = 3
            }else{
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
            let reusltText = `${arg[0] === undefined ? "아만" : arg} 서버의 떠상 목록입니다.\n`;
            
            if(timeset === 1){
                reusltText += "떠상 시간: 오전 4:00 ~ 오전 9:30\n\n";

            }else if(timeset === 2){
                reusltText += "떠상 시간: 오전 10:00 ~ 오후 3:30\n\n";

            }else if(timeset === 3){
                reusltText += "떠상 시간: 오후 4:00 ~ 오후 9:30\n\n";

            }else if(timeset === 4){
                reusltText += "떠상 시간: 오후 10:00 ~ 오전 3:30\n\n";
            } 



            const korlarkResult = await axios
            .get<korlarkResponse>(`https://api.korlark.com/merchants?limit=15&server=${targetServer}`);

            let isMerchantAvailablel = false;

            korlarkResult.data.merchants.forEach((row)=>{
                if(timeset === merchantTimeIndex(((new Date(Date.parse(row.created_at))).getHours() + 9 )% 24)){
                    isMerchantAvailablel = true;
                    reusltText += "-"+row.continent + "-\n " + row.items.map((item)=>{
                        if(item.type === 0){
                            return item.content + ' 카드';
                        }else if(item.type === 1){
                            if(item.content === "0"){
                                return "영웅 호감도";
                            }else if(item.content === "1"){
                                return "전설 호감도";
                            }
                        }else if(item.type === 2){
                            return item.content;
                        }
                        return;
                        
                    }).join(", ")+ "\n"
                }
            });
            if(!isMerchantAvailablel){
                return [{
                    "type": "text",
                    "body": "kloa에 보고된 떠상이 없습니다."
                }];
            }

            return [{
                "type": "text",
                "body": reusltText
            }];
            
        }
    }

    return;

}





