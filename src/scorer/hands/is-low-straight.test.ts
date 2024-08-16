import { isLowStraight } from "./is-low-straight";

describe(isLowStraight.name, () => {
    test.each([
        [[0, 1, 2, 3, 12], true],
        [[0, 1, 2, 3, 4], false],
    ])("Sorted ranks %o should return %o", (sortedRanks, expected) => {
        const actual = isLowStraight(sortedRanks);

        expect(actual).toStrictEqual(expected);
    });
});
