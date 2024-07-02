export const isContinuous = (sortedRanks: number[]) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    return straights.includes(sortedRanks.join(","));
};
