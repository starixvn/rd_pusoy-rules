export const isOnePair = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const pair = sameRankCounter.get(2)?.length || 0;
    return pair === 1 && (single === 3 || single === 1);
};
