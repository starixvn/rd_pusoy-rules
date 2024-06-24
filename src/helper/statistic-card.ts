export const countSameRank = (ranksMap: Map<number, number[]>) => {
    let sameRankCounter: Map<number, number[]> = new Map();

    ranksMap.forEach((value, key) => {
        sameRankCounter = sameRankCounter.pushItem(value.length, key);
    });

    return sameRankCounter;
};

export const statisticCard = (cards: number[]) => {
    let rankMap: Map<number, number[]> = new Map();
    const suitSet: Set<number> = new Set();

    cards.forEach((card) => {
        const rank = Math.floor(card / 4);
        const suit = card % 4;
        rankMap = rankMap.pushItem(rank, suit);
        suitSet.add(suit);
    });

    return { rankMap, suitSet };
};
