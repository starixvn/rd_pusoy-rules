import { accumulateFromOtherMap, pushItem } from "../map-helpers";

export const statisticCardByCountSameRank = (cards: number[]) => {
    let rankMap: Map<number, number[]> = new Map();

    cards.forEach((card) => {
        const rank = Math.floor(card / 4);
        rankMap = pushItem(rankMap, rank, card);
    });

    let sameRankCounter: Map<number, number[]> = new Map();
    rankMap.forEach((value) => {
        sameRankCounter = accumulateFromOtherMap(
            sameRankCounter,
            new Map([[value.length, value]]),
        );
    });

    return sameRankCounter;
};
