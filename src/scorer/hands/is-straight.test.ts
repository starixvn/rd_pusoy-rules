import { isStraight } from "./is-straight";

describe(isStraight.name, () => {
    test.each([
        [[0, 1, 2, 3, 12], true, true],
        [[0, 1, 2, 3, 12], false, false],
        [[0, 1, 2, 3, 4], true, true],
        [[0, 1, 2, 3, 4], false, true],
        [[0, 1, 2, 3, 5], true, false],
        [[0, 1, 2, 3, 5], false, false],
        [[0, 1, 12], true, true],
        [[0, 1], true, false],
        [[1, 2], true, false],
        [[0, 11, 12], true, false],
        [[8, 9, 1], true, false],
        [[0, 11, 1], true, false],
        [[0, 9, 10, 11, 12], true, false],
    ])("Sorted ranks %o should return %o", (sortedRanks, includeWheelStraight, expected) => {
        const actual = isStraight(sortedRanks, includeWheelStraight);

        expect(actual).toStrictEqual(expected);
    });
});
