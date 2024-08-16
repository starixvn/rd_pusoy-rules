import { isThreeOfAKind } from "./is-three-of-a-kind";

describe(isThreeOfAKind.name, () => {
    test.each([
        [
            new Map([
                [1, [0, 2]],
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
        const actual = isThreeOfAKind(sameRankCounter);

        expect(actual).toStrictEqual(expected);
    });
});
