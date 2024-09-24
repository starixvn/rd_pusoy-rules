export const isLowStraight = (sortedRanks: number[]) => {
    if (sortedRanks.length < 3) {
        return false;
    }

    const lowStraight = [...Array(sortedRanks.length - 1).keys(), 12];

    return JSON.stringify(lowStraight) == JSON.stringify(sortedRanks);
};
