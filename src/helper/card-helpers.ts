import { CardCollectionScore } from "../types";
import "../helper/map-helpers";

export const countSameRank = (ranksMap: Map<number, number[]>) => {
    const sameRankCounter: Map<number, number[]> = new Map();

    ranksMap.forEach((value, key) => {
        sameRankCounter.pushItem(value.length, key);
    });

    return sameRankCounter;
};

export const statisticCard = (cards: number[]) => {
    const rankMap: Map<number, number[]> = new Map();
    const suitSet: Set<number> = new Set();

    cards.forEach((card) => {
        const rank = Math.floor(card / 4);
        const suit = card % 4;
        rankMap.pushItem(rank, suit);
        suitSet.add(suit);
    });

    return { rankMap, suitSet };
};

export const isLarger = <T>(
    a: CardCollectionScore<T>,
    b: CardCollectionScore<T>,
): boolean => {
    if (a.type > b.type) {
        return true;
    }
    if (a.type === b.type && a.rank > b.rank) {
        return true;
    }
    if (a.type === b.type && a.rank === b.rank) {
        return a.suit > b.suit;
    }

    return false;
};
