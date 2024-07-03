export const isFourOfAKind = (sameRankCounter: Map<number, number[]>) => {
    const single = sameRankCounter.get(1)?.length || 0;
    const quadruple = sameRankCounter.get(4)?.length || 0;

    return quadruple === 1 && single === 1;
};
