export const isContinuous = (sortedRanks: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    return straights.includes(sortedRanks.join(","));
};

export const isLowStraight = (sortedRanks: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    const maxCard = sortedRanks[sortedRanks.length - 1];
    if (maxCard !== 12) {
        return false;
    }

    const remainCards = sortedRanks.slice(0, sortedRanks.length - 1);

    return straights.includes(remainCards.join(","));
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

    return trio === 1 && (single === 2 || single === 0);
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
