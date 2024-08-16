import { isTwoPairs } from "./is-two-pairs";

describe(isTwoPairs.name, () => {
    test.each([
        [
            new Map([
                [2, [0, 1]],
                [1, [1]],
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
        const actual = isTwoPairs(sameRankCounter);

        expect(actual).toStrictEqual(expected);
    });
});
