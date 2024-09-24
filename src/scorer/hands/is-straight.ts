import { isLowStraight } from "./is-low-straight";

export const isStraight = (sortedRanks: number[], includeWheelStraight: boolean = false) => {
    if (sortedRanks.length < 3) {
        return false;
    }

    if (includeWheelStraight && isLowStraight(sortedRanks)) {
        return true;
    }

    for (let i = 1; i < sortedRanks.length; i++) {
        if (sortedRanks[i] - sortedRanks[i - 1] !== 1) {
            return false;
        }
    }

    return true;
};
