export interface SimpleCharacterInfo {
    name: string;
    classname: string;
    level: number;
}

export interface CharacterPerServer {
    serverName: string;
    characterList: SimpleCharacterInfo[]
}

export interface CalenderEvent {
    CategoryName: string;
    ContentsName: string;
    ContentsIcon: string;
    MinItemLevel: number,
    StartTimes: string[],
    Location: string;
    RewardItems: RewardItem[]
}

export interface SimpleIslandEvent {
    name: string;
    startTime: Date[];
    reward: string;
}
export interface AbyssGuardians {
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
        Items: RewardItem[]
    }[]

}


export interface AbyssDungeons {
    Name: string,
    Description: string,
    MinCharacterLevel: number,
    MinItemLevel: number,
    AreaName: string,
    StartTime: string,
    EndTime: string,
    Image: string,
    RewardItems: RewardItem[]
}

export interface RewardItem {
    Name: string,
    Icon: string,
    Grade: string,
    StartTimes: string[]
}


export interface MarketStructure<T> {
    
  PageNo: number,
  PageSize: number,
  TotalCount: number,
  Items: T[]
}

export interface AuctionItem {
    Name: string,
    Grade: string,
    Tier: number,
    Level: null,
    Icon: string,
    GradeQuality: null,
    AuctionInfo: AuctionInfo,
    Options: AuctionOptions[],
}

export interface AuctionInfo {
    StartPrice: number,
    BuyPrice: number,
    BidPrice: number,
    EndDate: string,
    BidCount: number,
    BidStartPrice: number,
    IsCompetitive: boolean,
    TradeAllowCount: number,
}

export interface AuctionOptions {
    Type: string,
    OptionName: string,
    OptionNameTripod: string,
    Value: number,
    IsPenalty: boolean,
    ClassName: string,
}

export interface MarketItem {
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

export interface Recipe {
    itemName: string;
    materials: {
        materialName: string;
        materialCount: number;
    }[];
}


export interface CharacterInfo {
    ArmoryProfile	: Profile;
	ArmoryEquipment	: Equipment[];
	ArmoryAvatars	: Avatar[];
	ArmorySkills	: Skill[];
	ArmoryEngraving	: Engraving;
	ArmoryCard		: cards;
	ArmoryGem		: EquipGems;
	ColosseumInfo	: ColosseumInfo;
	Collectibles	: Collectible[];

}
export interface CollectiblePoint {
    PointName	:	string;
    Point	    :	number;
    MaxPoint	:	number;

}
export interface Collectible {
    interface	    :	string;
    Icon	    :	string;
    Point	    :	number;
    MaxPoint	:	number;
	CollectiblePoints : CollectiblePoint[];

}

export interface Coloseum {
    SeasonName	    :	string | null;
    Competitive	    :	string | null;
    TeamDeathmatch	:	string | null;
    Deathmatch	    :	string | null;
    TeamElimination	:	string | null;
    CoOpBattle	    :	string | null;

}
export interface ColosseumInfo {
    Rank	:	number;
    PreRank	:	number;
    Exp    	:	number;
	Colosseums : Coloseum[];

}

export interface EquipGems {
    Gems: Gem[];
    Effects: GemDescription[];
}

export interface Gem {
    Slot	:	number;
    Name	:	string;
    Icon	:	string;
    Level	:	number;
    Grade	:	string;
    Tooltip	:	string;
}

export interface GemDescription {
    GemSlot	    :	number;
    Name	    :	string;
    Description	:	string;
    Icon	    :	string;
    Tooltip	    :   string;
}

export interface Effect {
    Index	    : number;
    CardSlots	: number[];
    Items		: NameDescription[];

}
export interface Card {
    Slot	    :	number;
    Name	    :	string;
    Icon	    :	string;
    AwakeCount	:	number;
    AwakeTotal	:	number;
    Grade	    :	string;
    Tooltip	    :	string;
    }
export interface cards {
    Cards : Card [];
    Effects : Effect[];
}
export interface NameDescription {
    Name	    :	string;
    Description	:	string;
}
export interface AttachEngrave {
    Slot	: number;
    Name	: string;
    Icon	: string;
    Tooltip	: string;
}

export interface Engraving {
    Engravings : AttachEngrave[];
    Effects : NameDescription[];
}

export interface Skill {
    Name	: string;
    Icon	: string;
    Level	: number;
    interface	: string;
    IsAwakening	:	boolean
	Tripods	: Tripod[]
    Rune	: Rune | null
    Tooltip	: string;

}
export interface Rune {
    Name	: string;
    Icon	: string;
    Grade	: string;
    Tooltip	: string;
}
export interface Tripod {
    Tier	    : number;
    Slot	    : number;
    Name	    : string;
    Icon	    : string;
    Level	    : number;
    IsSelected	: boolean;
    Tooltip	    : string;
}

export interface Profile {
    Stats		        :   TypeValueWithTooltip[];
    Tendencies		    :   TypeValueWithMaxpoint[];
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
interface TypeValueWithMaxpoint extends TypeValue {
    MaxPoint: number    
}
interface TypeValueWithTooltip extends TypeValue {
    Tooltips: string[]
}

export interface TypeValue {
    Type: string;
    Value: number;
}

export interface Equipment{
    Type	: string;
    Name	: string;
    Icon	: string;
    Grade	: string;
    Tooltip : string;
}

export interface Avatar {
    interface	: string;
    Name	: string;
    Icon	: string;
    Grade	: string;
    IsSet	: string;
    IsInner	: string;
    Tooltip	: string;
}