import { pushItem } from "../map-helpers";

export const countSameRank = (ranksMap: Map<number, number[]>) => {
    let sameRankCounter: Map<number, number[]> = new Map();

    ranksMap.forEach((value, key) => {
        sameRankCounter = pushItem(sameRankCounter, value.length, key);
    });

    return sameRankCounter;
};
