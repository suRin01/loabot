import 'dotenv/config'

import { loaApiUrls } from "../constants/urls";
import { abyssDungeons, abyssGuardians, calenderEvent, characterPerServer, marketStructure, recipe, simpleIslandEvent } from "../types/loaApi";
import axios from 'axios';
import { chargeCalc, isToday } from './utils';
import { marketItem } from '../types/loaApi'; 
import { PrismaClient, stuff_price } from '@prisma/client';
import { basedItemRecipeList, battleItemRecipeList, category, foodItemRecipeList, specialItemRecipeList } from '../constants/strings';

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


export const getMarketData = async (categoryCode: number, itemGrade: string | null = null, pageNo : number = 1, sort:string = "DESC", itemName: string | null = null)=>{
    const searchParam = {
        "Sort": "CURRENT_MIN_PRICE ",
        "CategoryCode": categoryCode,
        "CharacterClass": "",
        "ItemTier": null,
        "ItemGrade": itemGrade,
        "ItemName": itemName,
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

export const getMarkeFullPagetData = async (categoryCode: number, itemGrade: string | null = null, sort:string = "DESC", itemName: string | null = null): Promise<marketItem[]> =>{
    const firstPage = await getMarketData(categoryCode, itemGrade, 1, sort, itemName);
    if(firstPage.TotalCount <= firstPage.PageSize){
        return firstPage.Items;
    }

    const totalPage = Math.trunc(firstPage.TotalCount / firstPage.PageSize) + 1;
    let totalPageList:marketItem[] = firstPage.Items;
    for(let idx = 2 ; idx <= totalPage ; idx ++){
        const tempPage = await getMarketData(categoryCode, itemGrade, idx, sort, itemName);
        totalPageList = totalPageList.concat(tempPage.Items);
    }
    


    return totalPageList;

}

export const persistMarketData = async(categoryCode: number, itemGrade: string | null = null, itemName: string | null = null)=>{
    const itemList = await getMarkeFullPagetData(categoryCode, itemGrade, "DESC", itemName);

    const prisma = new PrismaClient();
    await prisma.stuff_price.createMany({
        data: itemList.map((item)=>{
            return {
                name: item.Name,
                bundleCount: item.BundleCount,
                previous_day_avg: item.YDayAvgPrice,
                current_price: item.CurrentMinPrice,
                input_id: "cron",
                category: categoryCode,
            }
        })
    })

    return true;
}


export const dbStuffSearch = async(categort:number)=>{
    const today = new Date();
    const start = new Date(today);
    start.setHours(0);
    const end = new Date(today);
    end.setHours(23);
    const prisma = new PrismaClient();
    const stuffList = await prisma.stuff_price.findMany({
        where:{
            input_dt:{
                gte: start,
                lte: end
            },
            category:{
                equals: categort
            }
        }
    })


    return stuffList;
}


export const itemCraftPrinceing = async(categoryCode:number)=>{
    let recipeList:recipe []= [];
    let marketData:stuff_price[] = [];
    let craftBundleCount = 0;
    
    const stuffData = await dbStuffSearch(category.ingreItem);
    const priceMap: Record<string, number> = {"골드": 1};
    const bundleMap: Record<string, number> = {"골드": 1};

    if(categoryCode === category.battleItem){
        recipeList = battleItemRecipeList;
        marketData = await dbStuffSearch(category.battleItem);
        craftBundleCount = 3;
    }else if(categoryCode === category.food){
        recipeList = foodItemRecipeList
        marketData = await dbStuffSearch(category.food);
        craftBundleCount = 1;
    }else if(categoryCode === category.enforceItem){
        recipeList = specialItemRecipeList
        marketData = await dbStuffSearch(category.enforceItem);
        craftBundleCount = 1;
        priceMap["현자의 돌"] = 0;
        bundleMap["현자의 돌"] = 1;
    }

    stuffData.forEach((item)=>{
        priceMap[item.name] = item.current_price;
        bundleMap[item.name] = item.bundleCount;
    });

    const marketDataMap: Record<string, number> = {};
    marketData.forEach((item)=>{
        marketDataMap[item.name] = item.current_price;
    });

    return recipeList.map((recipe)=>{
        let craftCost = 0;
        let itemName = recipe.itemName;
        if(categoryCode === category.enforceItem){
            itemName = itemName.replace(/(\(.*\))/i, '')
            craftBundleCount = 1;
            if(itemName.startsWith("하급") || itemName.startsWith("중급")){
                craftBundleCount = 30;
            }else if(itemName.startsWith("상급")){
                craftBundleCount = 20;
            }else if(itemName.startsWith("최상")){
                craftBundleCount = 15;
            }
        }
        recipe.materials.forEach((item)=>{
            const bundlePrice = priceMap[item.materialName]
            const bundleCount = bundleMap[item.materialName]
            if(bundleCount === undefined || bundlePrice === undefined){
                throw new Error("cannot find base item");
            }
            const pricePerItem = bundlePrice / bundleCount;
            craftCost += pricePerItem * item.materialCount;
        })

        console.log(`${recipe.itemName}, ${marketDataMap[itemName]}, ${craftBundleCount}, ${craftCost}, ${chargeCalc(marketDataMap[itemName])}`)

        return {
            name: recipe.itemName,
            marketPrice: marketDataMap[itemName],
            craftCost: (craftCost / craftBundleCount).toFixed(3),
            profit: (chargeCalc(marketDataMap[itemName]) - craftCost/craftBundleCount).toFixed(3)
        }
        
    })
}