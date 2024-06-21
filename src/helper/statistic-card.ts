import { accumulateItems } from "./map-helpers";

export const countSameRank = (ranksMap: Map<number, number[]>) => {
    const sameRankCounter: Map<number, number[]> = new Map();

    ranksMap.forEach((value, key) => {
        accumulateItems(sameRankCounter, value.length, key);
    });

    return sameRankCounter;
};

export const statisticCard = (cards: number[]) => {
    const rankMap: Map<number, number[]> = new Map();
    const suitSet: Set<number> = new Set();

    cards.forEach((card) => {
        const rank = Math.floor(card / 4);
        const suit = card % 4;
        accumulateItems(rankMap, rank, suit);
        suitSet.add(suit);
    });

    return { rankMap, suitSet };
};
