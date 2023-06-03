import { msgStrings } from "../constants/strings";
import { messageTemplate } from "../types/messageTemplate";

export const argCheck = (arg: string | undefined, failMessage: string): messageTemplate[] | string => {
    if (arg === undefined) {
        return [{
            "type": "text",
            "body": failMessage
        }]
    }
    return arg;
}

export const argNumCheck = (arg: string | undefined, failMessage: string): messageTemplate[] | number => {
    const stringArg = argCheck(arg, failMessage);
    if (typeof stringArg !== 'string') {
        return stringArg;
    }
    const value = parseInt(stringArg);
    if (isNaN(value)) {
        return [{
            "type": "text",
            "body": msgStrings.argNumError
        }]
    }

    return value;
}

export const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}


export const riceCalculator = (value: number) => {

    const fourMemberParty = value * 57 / 80;
    const eightMemberParty = value * 133 / 160;
    return [{
        "type": "text",
        "body": "8인 입찰가: " + eightMemberParty.toFixed() + "골드\n8인 추천 입찰가: " + (eightMemberParty * 10 / 11 + 1).toFixed() + "골드"
            + "\n4인 입찰가: " + fourMemberParty.toFixed() + "골드\n4인 추천 입찰가: " + (fourMemberParty * 10 / 11 + 1).toFixed() + "골드"
    }]
}