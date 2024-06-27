import { Settler } from "./settler";
import { Hand, ScoreConfig } from "./types";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: {
        threeFlushes: 3,
        sixPairs: 6,
        dragon: 12,
    },
    crack: 6,
    pusoy: {
        partial: 3,
        full: 6,
    },
    royalty: {
        front: {
            threeOfAKind: 3,
        },
        middle: {
            fullHouse: 2,
            fourOfAKind: 8,
            straightFlush: 10,
            royalFlush: 20,
        },
        back: {
            fourOfAKind: 4,
            straightFlush: 5,
            royalFlush: 10,
        },
    },
};
Settler.configure(scoreConfig);

describe("settle", () => {
    describe("4 players alert natural", () => {
        test.each([
            [
                {
                    front: [40, 51, 37],
                    middle: [17, 19, 11, 1, 7],
                    back: [30, 25, 38, 32, 41],
                },
                {
                    front: [36, 28, 39],
                    middle: [49, 50, 6, 2, 23],
                    back: [9, 12, 10, 13, 8],
                },
                {
                    front: [47, 15, 44],
                    middle: [29, 35, 31, 4, 33],
                    back: [3, 0, 24, 26, 27],
                },
                {
                    front: [42, 43, 48],
                    middle: [14, 34, 45, 46, 5],
                    back: [18, 21, 20, 16, 22],
                },
                [-27, -1, 27, 1],
                "Case 2024.0624.1602",
            ],
            [
                {
                    front: [7, 35, 19],
                    middle: [18, 30, 42, 22, 2],
                    back: [8, 48, 12, 32, 28],
                },
                {
                    front: [3, 44, 6],
                    middle: [24, 43, 38, 31, 33],
                    back: [49, 45, 37, 5, 13],
                },
                {
                    front: [23, 41, 20],
                    middle: [0, 27, 25, 9, 16],
                    back: [39, 40, 29, 34, 47],
                },
                {
                    front: [46, 36, 51],
                    middle: [14, 11, 4, 1, 50],
                    back: [26, 21, 17, 10, 15],
                },
                [9, -1, -3, -5],
                "Case 2024.0624.1626",
            ],
        ])(
            "sum score p0 %j, p1 %j, p2 %j, p3 %j should be %j (%s)",
            (p0, p1, p2, p3, expected, caseName) => {
                const result = Settler.settle(
                    [p0, p1, p2, p3],
                    [true, true, true, true],
                );
                console.log(`${caseName} \n`, result);

                const sum = result.map((s) => s.sum);
                expect(sum).toStrictEqual(expected);
            },
        );
    });
});
