import { msgStrings } from "../constants/strings";
import { messageTemplate } from "../types/messageTemplate";

export const argCheck = (
  arg: string | undefined,
  failMessage: string
): messageTemplate[] | string => {
  if (arg === undefined) {
    return [
      {
        type: "text",
        body: failMessage,
      },
    ];
  }
  return arg;
};

export const argNumCheck = (
  arg: string | undefined,
  failMessage: string
): messageTemplate[] | number => {
  const stringArg = argCheck(arg, failMessage);
  if (typeof stringArg !== "string") {
    return stringArg;
  }
  const value = parseInt(stringArg);
  if (isNaN(value)) {
    return [
      {
        type: "text",
        body: msgStrings.argNumError,
      },
    ];
  }

  return value;
};

export const merchantTimeIndex = (hour: number) => {
  /*
        오후 4:00 ~ 오후 9:30       첫타임
        오후 10:00 ~ 오전 3:30      둘째타임
        오전 4:00 ~ 오전 9:30       셋째타임
        오전 10:00 ~ 오후 3:30      넷째타임
    */
  if (4 <= hour && hour <= 9) {
    return 1;
  } else if (10 <= hour && hour <= 15) {
    return 2;
  } else if (16 <= hour && hour <= 21) {
    return 3;
  } else {
    return 4;
  }
};

export const isToday = (someDate: Date) => {
  const today = new Date(new Date().setHours(new Date().getHours() + 9));
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export const riceCalculator = (value: number) => {
  const fourMemberParty = (value * 57) / 80;
  const eightMemberParty = (value * 133) / 160;
  return [
    {
      type: "text",
      body:
        "8인 입찰가: " +
        eightMemberParty.toFixed() +
        " 골드\n8인 추천 입찰가: " +
        ((eightMemberParty * 10) / 11 + 1).toFixed() +
        " 골드" +
        "\n4인 입찰가: " +
        fourMemberParty.toFixed() +
        " 골드\n4인 추천 입찰가: " +
        ((fourMemberParty * 10) / 11 + 1).toFixed() +
        " 골드",
    },
  ];
};

/**
 * 경매장 수수료 계산
 * @param price 경매장 판매가
 * @returns number 수수료
 */
export const chargeCalc = (price: number) => {
  if (price === 1) {
    return price;
  } else if (price * 0.05 < 1) {
    return price - 1;
  } else {
    return price - Math.round(price * 0.05);
  }
};

export const setStringLength = (text: string, size: number) => {
  let wordCount = 0;
  Array.from(text).forEach((character) => {
    if (/[0-9|\s|\[\]\,|\.\-]/gm.test(character)) {
      wordCount += 1;
    } else {
      wordCount += 2;
    }
  });
  let output = text;
  for (let idx = 0; idx < size - wordCount; idx++) {
    output += " ";
  }

  return output;
};

/**
 * 야매 주간 골드 계산기
 * @param itemLevel
 * @returns
 */
export const weeklyProfitCalc = (itemLevel: number): number => {
  if (itemLevel >= 1640) {
    return 81000;
  } else if (1630 <= itemLevel && itemLevel < 1640) {
    return 74000;
  } else if (1620 <= itemLevel && itemLevel < 1630) {
    return 42000;
  } else if (1610 <= itemLevel && itemLevel < 1620) {
    return 32000;
  } else if (1600 <= itemLevel && itemLevel < 1610) {
    return 28000;
  } else if (1580 <= itemLevel && itemLevel < 1600) {
    return 23000;
  } else if (1560 <= itemLevel && itemLevel < 1580) {
    return 16500;
  } else if (1550 <= itemLevel && itemLevel < 1560) {
    return 16000;
  } else if (1540 <= itemLevel && itemLevel < 1550) {
    return 15500;
  } else if (1520 <= itemLevel && itemLevel < 1540) {
    return 12400;
  } else if (1500 <= itemLevel && itemLevel < 1520) {
    return 9900;
  } else if (1490 <= itemLevel && itemLevel < 1500) {
    return 8400;
  }

  return 0;
};

export const cookieParser = (cookieString: string): Record<string, string> => {
  const a: Record<string, string> = {};
  const cookies = cookieString
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      if (v[0] === "" || v[1] === undefined) {
        return acc;
      }
      if (v[0] !== undefined) {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      }
      return acc;
    }, a);
  return cookies;
};
