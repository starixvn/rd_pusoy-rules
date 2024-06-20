export const countSameRank = (ranksMap: Map<number, number[]>) => {
    const sameRankCounter: Map<number, number[]> = new Map();

    ranksMap.forEach((value, key) => {
        accumulateItems(sameRankCounter, value.length, key);
    });

    return sameRankCounter;
};

export const accumulateItems = (
    map: Map<number, number[]>,
    key: number,
    value: number
) => {
    if (!map.has(key)) {
        map.set(key, [value]);
    } else {
        map.get(key)?.push(value);
    }
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

export const countItems = (map: Map<number, number>, item: number) => {
    if (!map.has(item)) {
        map.set(item, 1);
    } else {
        map.set(item, (map.get(item) as number) + 1);
    }
};
