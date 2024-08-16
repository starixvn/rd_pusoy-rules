import { countSameRank } from "./count-same-rank";

describe(countSameRank.name, () => {
    test.each([
        [
            new Map([
                [1, [1, 2, 3]],
                [2, [0, 1, 3]],
                [4, [1, 2]],
            ]),
            new Map([
                [3, [1, 2]],
                [2, [4]],
            ]),
        ],
        [
            new Map([
                [1, [1]],
                [2, [0, 1, 3]],
                [4, [1, 2]],
            ]),
            new Map([
                [3, [2]],
                [2, [4]],
                [1, [1]],
            ]),
        ],
    ])("Rank map %o should return %o", (ranksMap, expected) => {
        const actual = countSameRank(ranksMap);

        expect(actual).toStrictEqual(expected);
    });
});
