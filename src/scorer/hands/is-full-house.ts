export const isFullHouse = (sameRankCounter: Map<number, number[]>) => {
    const pair = sameRankCounter.get(2)?.length || 0;
    const trio = sameRankCounter.get(3)?.length || 0;

    return pair === 1 && trio === 1;
};
