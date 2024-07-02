import { getSortedIncreaseKeys } from "./get-sorted-increase-keys";

describe(getSortedIncreaseKeys.name, () => {
    test.each([
        [
            new Map([
                [5, [1, 2]],
                [2, [2, 3]],
            ]),
            [2, 5],
        ],
        [
            new Map([
                [0, [1, 2]],
                [5, [1, 2]],
                [2, [2, 3]],
                [1, [3, 4]],
            ]),
            [0, 1, 2, 5],
        ],
    ])("Rank map %o should return %o", (map, expected) => {
        const actual = getSortedIncreaseKeys(map);

        expect(actual).toStrictEqual(expected);
    });
});
