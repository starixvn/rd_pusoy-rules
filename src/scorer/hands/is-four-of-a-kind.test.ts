import { isFourOfAKind } from "./is-four-of-a-kind";

describe(isFourOfAKind.name, () => {
    test.each([
        [
            new Map([
                [1, [0]],
                [4, [1]],
            ]),
            true,
        ],
        [
            new Map([
                [2, [1]],
                [3, [3]],
            ]),
            false,
        ],
    ])("Same rank counter %o should return %o", (sameRankCounter, expected) => {
        const actual = isFourOfAKind(sameRankCounter);

        expect(actual).toStrictEqual(expected);
    });
});
