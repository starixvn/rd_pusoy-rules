import { isStraight } from "./is-straight";

describe(isStraight.name, () => {
    test.each([
        [[0, 1, 2, 3, 12], true, true],
        [[0, 1, 2, 3, 12], false, false],
        [[0, 1, 2, 3, 4], true, true],
        [[0, 1, 2, 3, 4], false, true],
        [[0, 1, 2, 3, 5], true, false],
        [[0, 1, 2, 3, 5], false, false],
    ])(
        "Sorted ranks %o should return %o",
        (sortedRanks, includeWheelStraight, expected) => {
            const actual = isStraight(sortedRanks, includeWheelStraight);

            expect(actual).toStrictEqual(expected);
        },
    );
});
