import { ScoreConfig } from "../src/types";
import { createPusoyRules } from "../src/settler";
import { Natural } from "../src/const";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: [
        {
            name: Natural.Dragon,
            units: 12,
        },
        {
            name: Natural.SixPairs,
            units: 6,
        },
        {
            name: Natural.ThreeFlushes,
            units: 3,
        },
        {
            name: Natural.ThreeStraights,
            units: 3,
        },
    ],
    crack: 6,
    pusoy: {
        mini: 3,
        full: {
            isWinnerTakeAll: true,
            units: 6,
        },
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
const pusoy = createPusoyRules(scoreConfig);

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
            [
                {
                    front: [11, 10, 32],
                    middle: [33, 41, 27, 7, 1],
                    back: [40, 6, 2, 43, 15],
                },
                {
                    front: [44, 42, 45],
                    middle: [48, 23, 31, 50, 16],
                    back: [39, 26, 37, 24, 36],
                },
                {
                    front: [4, 30, 28],
                    middle: [18, 38, 34, 14, 22],
                    back: [5, 17, 13, 21, 9],
                },
                {
                    front: [49, 51, 35],
                    middle: [8, 47, 0, 3, 46],
                    back: [12, 20, 29, 25, 19],
                },
                [-18, 0, 16, 2],
                "Case 2024.06.28.16.20",
            ],
            [
                {
                    front: [45, 27, 50],
                    middle: [37, 0, 17, 5, 15],
                    back: [40, 22, 8, 26, 42],
                },
                {
                    front: [9, 20, 38],
                    middle: [43, 19, 51, 31, 7],
                    back: [13, 14, 12, 3, 2],
                },
                {
                    front: [35, 46, 48],
                    middle: [4, 1, 11, 6, 10],
                    back: [25, 16, 34, 23, 29],
                },
                {
                    front: [47, 39, 49],
                    middle: [24, 28, 32, 18, 21],
                    back: [44, 36, 41, 30, 33],
                },
                [-18, 8, -1, 11],
                "Case 2024.07.01.16.47",
            ],
        ])(
            "sum score p0 %j, p1 %j, p2 %j, p3 %j should be %j (%s)",
            (p0, p1, p2, p3, expected, caseName) => {
                const result = pusoy.settle([p0, p1, p2, p3]);
                console.log(`${caseName} \n`, result);

                const sum = result.map((s) => s.sum);
                expect(sum).toStrictEqual(expected);
            },
        );
    });
});
