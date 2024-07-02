import { sortIncrease } from "./sort-increase";

describe(sortIncrease.name, () => {
    test.each([
        [
            [0, 1, 12, 33, 4],
            [0, 1, 4, 12, 33],
        ],
        [
            [5, 5, 5, 5, 3],
            [3, 5, 5, 5, 5],
        ],
    ])("Rank array %o should return %o", (origin, expected) => {
        const actual = sortIncrease(origin);

        expect(actual).toStrictEqual(expected);
    });
});
