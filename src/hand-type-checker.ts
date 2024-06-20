export const isContinuous = (cards: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    return straights.includes(cards.sort().join(","));
};

export const isLowStraight = (cards: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    cards.sort();

    const maxCard = cards[cards.length - 1];
    const remainCards = cards.slice(0, cards.length - 1);

    return maxCard === 12 && straights.includes(remainCards.join(","));
};

export const isDistinct = (
    cards: number[],
    ranksMap: Map<number, number[]>
) => {
    return cards.length === ranksMap.size;
};

export const isOnePair = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const pair = sameRankCounter.get(2)?.length || 0;
    return pair === 1 && (single === 3 || single === 1);
};

export const isTwoPair = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const pair = sameRankCounter.get(2)?.length || 0;

    return pair === 2 && single === 1;
};

export const isThreeOfAKind = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const trio = sameRankCounter.get(3)?.length || 0;

    return trio === 1 && (single === 3 || single === 0);
};

export const isFullHouse = (sameRankCounter: Map<number, number[]>) => {
    const pair = sameRankCounter.get(2)?.length || 0;
    const trio = sameRankCounter.get(3)?.length || 0;

    return pair === 1 && trio === 1;
};

export const isFourOfAKind = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const quadruple = sameRankCounter.get(4)?.length || 0;

    return quadruple === 1 && single === 1;
};
