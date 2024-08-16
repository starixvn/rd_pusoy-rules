import { isOnePair } from "./is-one-pair";

describe(isOnePair.name, () => {
    test.each([
        [
            new Map([
                [1, [0, 1, 2]],
                [2, [3]],
            ]),
            true,
        ],
        [
            new Map([
                [2, [0]],
                [3, [1]],
            ]),
            false,
        ],
    ])("Same rank counter %o should return %o", (sameRankCounter, expected) => {
        const actual = isOnePair(sameRankCounter);

        expect(actual).toStrictEqual(expected);
    });
});
