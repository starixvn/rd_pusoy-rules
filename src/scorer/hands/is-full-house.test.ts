import { isFullHouse } from "./is-full-house";

describe(isFullHouse.name, () => {
    test.each([
        [
            new Map([
                [2, [0]],
                [3, [1]],
            ]),
            true,
        ],
        [
            new Map([
                [1, [0]],
                [4, [1]],
            ]),
            false,
        ],
    ])("Same rank counter %o should return %o", (sameRankCounter, expected) => {
        const actual = isFullHouse(sameRankCounter);

        expect(actual).toStrictEqual(expected);
    });
});
