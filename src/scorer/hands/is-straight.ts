import { isLowStraight } from "./is-low-straight";

export const isStraight = (
    sortedRanks: number[],
    includeWheelStraight: boolean = false,
) => {
    const straights = "0,1,2,3,4,5,6,7,8,9,10,11,12";

    if (!includeWheelStraight) {
        return straights.includes(sortedRanks.join(","));
    }

    return (
        straights.includes(sortedRanks.join(",")) || isLowStraight(sortedRanks)
    );
};
