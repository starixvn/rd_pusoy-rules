export const isThreeOfAKind = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const trio = sameRankCounter.get(3)?.length || 0;

    return trio === 1 && (single === 2 || single === 0);
};
