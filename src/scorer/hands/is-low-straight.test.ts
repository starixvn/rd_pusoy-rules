import { isLowStraight } from "./is-low-straight";

describe(isLowStraight.name, () => {
    test.each([
        [[0, 1, 2, 3, 12], true],
        [[0, 1, 12], true],
        [[0, 1, 2, 3, 4], false],
        [[0, 11, 12], false],
        [[0, 9, 10, 11, 12], false],
        [[], false],
        [[0], false],
        [[12], false],
        [[10], false],
        [[0, 12], false],
    ])("Sorted ranks %o should return %o", (sortedRanks, expected) => {
        const actual = isLowStraight(sortedRanks);

        expect(actual).toStrictEqual(expected);
    });
});
