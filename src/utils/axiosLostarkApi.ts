import 'dotenv/config'

import { loaApiUrls } from "../constants/urls";
import { abyssDungeons, abyssGuardians, calenderEvent, characterPerServer, marketStructure, simpleIslandEvent } from "../types/loaApi";
import axios from 'axios';
import { isToday } from './utils';

export const getUserSubCharacter = async (username: string): Promise<characterPerServer[] | undefined> => {
    return await axios
        .get(`${loaApiUrls.characterPrefix}${encodeURI(username)}${loaApiUrls.characterPostfix}`, {
            headers: { authorization: `bearer ${process.env.loaApiKey}` },
        })
        .then((results) => {
            if (Array.isArray(results.data)) {
                let characterList: characterPerServer[] = [];
                results.data.reduce((acc: characterPerServer[], cur) => {
                    let existServerCheck = false;
                    acc.forEach((serverList) => {
                        if (serverList.serverName === cur.ServerName) {
                            serverList.characterList.push({
                                name: cur.CharacterName,
                                classname: cur.CharacterClassName,
                                level: cur.ItemMaxLevel,
                            })
                            existServerCheck = true;
                        }
                    })
                    if (existServerCheck) {
                        return acc;
                    }

                    acc.push({
                        serverName: cur.ServerName,
                        characterList: [{
                            name: cur.CharacterName,
                            classname: cur.CharacterClassName,
                            level: cur.ItemMaxLevel,
                        }]
                    })
                    return acc;
                }, characterList)

                return characterList;
            }

            return undefined;
        })
}

export const getTodayExportaionIsland = async ():Promise<simpleIslandEvent[]>  => {
    const todayIslandList: calenderEvent[] = await axios
        .get(loaApiUrls.weeklyCalender, {
            headers: { authorization: `bearer ${process.env.loaApiKey}` },
        })
        .then((results) => {
            return results.data
                .filter((island: calenderEvent) => {
                    if (island.CategoryName === "모험 섬") return island;
                })
                .filter((island: calenderEvent) => {
                    let isTodayCheck = false;
                    island.StartTimes.forEach((startTime) => {
                        if (isToday(new Date(startTime))) {
                            isTodayCheck = true;
                        }
                    })
                    if (isTodayCheck) return island;
                })
        });
    let result:simpleIslandEvent[] = [];
    todayIslandList.forEach((event)=>{
        let tempEventData:simpleIslandEvent = {
            name: event.ContentsName,
            reward: "",
            startTime: []
        };
        event.RewardItems.some((item)=>{
            if(item.Name.includes("카드")){
                tempEventData.reward = "카드"
                return true;
            }else if(item.Name.includes("골드")){
                tempEventData.reward = "골드"
                return true;
            }else if(item.Name.includes("주화")){
                tempEventData.reward = "주화, 실링"
                return true;
            }
        })
        if(tempEventData.reward === ""){
            tempEventData.reward = "실링"
        }
        tempEventData.startTime = event.StartTimes.map((time)=>{
            if((new Date(time)).getDate() === (new Date).getDate()) return new Date(time)
        }).filter( x => x !== undefined) as Date[];
        result.push(tempEventData);
    })
    return result;
}

export const getWeeklyAbyssGuardians = async ()=>{
    const weeklyAbyssGuardians: abyssGuardians = await axios
    .get(loaApiUrls.weeklyAbyssGuardians, {
        headers: { authorization: `bearer ${process.env.loaApiKey}` },
    })
    .then((results) => {
        return results.data;
    });
    
    return  Array.of(weeklyAbyssGuardians.Raids[0].Name, weeklyAbyssGuardians.Raids[1].Name, weeklyAbyssGuardians.Raids[2].Name)
}


export const getWeeklyAbyssDungeouns = async ()=>{
    const weeklyAbyssDungeons: abyssDungeons[] = await axios
    .get(loaApiUrls.weeklyAbyssDungeons, {
        headers: { authorization: `bearer ${process.env.loaApiKey}` },
    })
    .then((results) => {
        return results.data;
    });

    return {
        title: weeklyAbyssDungeons[0].AreaName,
        areaList : Array.of(weeklyAbyssDungeons[0].Name, weeklyAbyssDungeons[1].Name)
    }
}


export const getMarketData = async (categoryCode: number, itemGrade: string | null = null, pageNo : number = 0, sort:string = "DESC")=>{
    const searchParam = {
        "Sort": "CURRENT_MIN_PRICE ",
        "CategoryCode": categoryCode,
        "CharacterClass": "",
        "ItemTier": null,
        "ItemGrade": itemGrade,
        "ItemName": null,
        "PageNo": pageNo,
        "SortCondition": sort
      }
    const marketData: marketStructure = await axios
    .post(loaApiUrls.market, searchParam, {
        headers: { authorization: `bearer ${process.env.loaApiKey}` },
    })
    .then((results) => {
        return results.data;
    });

    return marketData;

}