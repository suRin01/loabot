export interface simpleCharacterInfo {
    name: string;
    classname: string;
    level: number;
}

export interface characterPerServer {
    serverName: string;
    characterList: simpleCharacterInfo[]
}

export interface calenderEvent {
    CategoryName: string;
    ContentsName: string;
    ContentsIcon: string;
    MinItemLevel: number,
    StartTimes: string[],
    Location: string;
    RewardItems: rewardItem[]
}

export interface simpleIslandEvent {
    name: string;
    startTime: Date[];
    reward: string;
}
export interface abyssGuardians {
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


export interface abyssDungeons {
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

export interface rewardItem {
    Name: string,
    Icon: string,
    Grade: string,
    StartTimes: string[]
}


export interface marketStructure {
    
  PageNo: number,
  PageSize: number,
  TotalCount: number,
  Items: marketItem[]
}

export interface marketItem {
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

export interface recipe {
    itemName: string;
    materials: {
        materialName: string;
        materialCount: number;
    }[];
}


export interface characterInfo {
    ArmoryProfile	: profile;
	ArmoryEquipment	: equipment[];
	ArmoryAvatars	: avatar[];
	ArmorySkills	: skill[];
	ArmoryEngraving	: engraving;
	ArmoryCard		: cards;
	ArmoryGem		: equipGems;
	ColosseumInfo	: colosseumInfo;
	Collectibles	: collectible[];

}
export interface CollectiblePoint {
    PointName	:	string;
    Point	    :	number;
    MaxPoint	:	number;

}
export interface collectible {
    interface	    :	string;
    Icon	    :	string;
    Point	    :	number;
    MaxPoint	:	number;
	CollectiblePoints : CollectiblePoint[];

}

export interface coloseum {
    SeasonName	    :	string | null;
    Competitive	    :	string | null;
    TeamDeathmatch	:	string | null;
    Deathmatch	    :	string | null;
    TeamElimination	:	string | null;
    CoOpBattle	    :	string | null;

}
export interface colosseumInfo {
    Rank	:	number;
    PreRank	:	number;
    Exp    	:	number;
	Colosseums : coloseum[];

}

export interface equipGems {
    Gems: gem[];
    Effects: gemDescription[];
}

export interface gem {
    Slot	:	number;
    Name	:	string;
    Icon	:	string;
    Level	:	number;
    Grade	:	string;
    Tooltip	:	string;
}

export interface gemDescription {
    GemSlot	    :	number;
    Name	    :	string;
    Description	:	string;
    Icon	    :	string;
    Tooltip	    :   string;
}

export interface effect {
    Index	    : number;
    CardSlots	: number[];
    Items		: nameDescription[];

}
export interface card {
    Slot	    :	number;
    Name	    :	string;
    Icon	    :	string;
    AwakeCount	:	number;
    AwakeTotal	:	number;
    Grade	    :	string;
    Tooltip	    :	string;
    }
export interface cards {
    Cards : card [];
    Effects : effect[];
}
export interface nameDescription {
    Name	    :	string;
    Description	:	string;
}
export interface attachEngrave {
    Slot	: number;
    Name	: string;
    Icon	: string;
    Tooltip	: string;
}

export interface engraving {
    Engravings : attachEngrave[];
    Effects : nameDescription[];
}

export interface skill {
    Name	: string;
    Icon	: string;
    Level	: number;
    interface	: string;
    IsAwakening	:	boolean
	Tripods	: tripod[]
    Rune	: rune | null
    Tooltip	: string;

}
export interface rune {
    Name	: string;
    Icon	: string;
    Grade	: string;
    Tooltip	: string;
}
export interface tripod {
    Tier	    : number;
    Slot	    : number;
    Name	    : string;
    Icon	    : string;
    Level	    : number;
    IsSelected	: boolean;
    Tooltip	    : string;
}

export interface profile {
    Stats		        :   typeValueWithTooltip[];
    Tendencies		    :   typeValueWithMaxpoint[];
    CharacterImage	    :	string;
    PvpGradeName	    :	string;
    TownName	        :	string;
    Title	            :	string;
    GuildMemberGrade	:	string;
    GuildName	        :	string;
    ServerName	        :	string;
    CharacterName	    :	string;
    CharacterClassName	:	string;
    ExpeditionLevel	    :	number;
    TownLevel	        :	number;
    UsingSkillPoint	    :	number;
    TotalSkillPoint	    :	number;
    CharacterLevel	    :	number;
    ItemAvgLevel	    :	number;
    ItemMaxLevel	    :	number;

}
interface typeValueWithMaxpoint extends typeValue {
    MaxPoint: number    
}
interface typeValueWithTooltip extends typeValue {
    Tooltips: string[]
}

export interface typeValue {
    Type: string;
    Value: number;
}

export interface equipment{
    interface	: string;
    Name	: string;
    Icon	: string;
    Grade	: string;
    Tooltip : string;
}

export interface avatar {
    interface	: string;
    Name	: string;
    Icon	: string;
    Grade	: string;
    IsSet	: string;
    IsInner	: string;
    Tooltip	: string;
}