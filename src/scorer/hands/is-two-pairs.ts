export const isTwoPairs = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const pair = sameRankCounter.get(2)?.length || 0;

    return pair === 2 && single === 1;
};
