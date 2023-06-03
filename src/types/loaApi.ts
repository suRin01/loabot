export type simpleCharacterInfo = {
    name: string;
    classname: string;
    level: number;
}

export type characterPerServer = {
    serverName: string;
    characterList: simpleCharacterInfo[]
}

export type calenderEvent = {
    CategoryName: string;
    ContentsName: string;
    ContentsIcon: string;
    MinItemLevel: number,
    StartTimes: string[],
    Location: string;
    RewardItems: rewardItem[]
}

export type simpleIslandEvent = {
    name: string;
    startTime: Date[];
    reward: string;
}
export type abyssGuardians = {
    Raids: {
        Name: string,
        Description: string,
        MinCharacterLevel: number,
        MinItemLevel: number,
        RequiredClearRaid: string,
        StartTime: string,
        EndTime: string,
        Image: string
    }[]
    ,
    RewardItems: {
        ExpeditionItemLevel: number,
        Items: rewardItem[]
    }[]

}


export type abyssDungeons = {
    Name: string,
    Description: string,
    MinCharacterLevel: number,
    MinItemLevel: number,
    AreaName: string,
    StartTime: string,
    EndTime: string,
    Image: string,
    RewardItems: rewardItem[]
}

export type rewardItem = {
    Name: string,
    Icon: string,
    Grade: string,
    StartTimes: string[]
}


export type marketStructure = {
    
  PageNo: number,
  PageSize: number,
  TotalCount: number,
  Items: marketItem[]
}

export type marketItem = {
    Id: number,
    Name: string,
    Grade: string,
    Icon: string,
    BundleCount: number,
    TradeRemainCount: number,
    YDayAvgPrice: number,
    RecentPrice: number,
    CurrentMinPrice: number
}