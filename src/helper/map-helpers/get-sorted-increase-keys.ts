export const getSortedIncreaseKeys = function <V>(
    origin: Map<number, V>,
): number[] {
    return Array.from(origin.keys()).sort((a, b) => a - b);
};
