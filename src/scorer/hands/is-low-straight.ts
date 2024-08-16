export const isLowStraight = (sortedRanks: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    const maxRank = sortedRanks[sortedRanks.length - 1];
    const minRank = sortedRanks[0];
    if (maxRank !== 12 || minRank !== 0) {
        return false;
    }

    const remainCards = sortedRanks.slice(0, sortedRanks.length - 1);

    return straights.includes(remainCards.join(","));
};
