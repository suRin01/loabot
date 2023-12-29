export enum GradeCagegory {
    common = "일반",
    advanced = "고급",
    rare = "희귀",
    epic = "영웅",
    legendary = "전설",
    relic = "유물",
    ancient = "고대",
    mythology = "신화",
}

export enum StatCategory{
    Strengte = "힘",
    Dexterity = "민첩",
    Intelligence = "지능",
}

export enum BasicStatCategory{
    AttackPower = "공격력",
    MaxHp = "최대생명력",
}

export enum BattleStatCategory{
    Crit = "치명",
    Specialization = "특화",
    Swiftness = "신속",
    Domination = "제압",
    Endurance = "인내",
    Expertise = "숙련",
}

export interface Accessory{
    grade: GradeCagegory;
    name: string;
    quality: number;
    engrave: Engravement[];
    stat: Stat[];

}

export interface Stat{
    name: StatCategory|BasicStatCategory|BattleStatCategory;
    value: number;
}


export interface Engravement{
    engrave: string;
    value: number;
    isNegative: boolean;
}
