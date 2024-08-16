import { ScoreConfig } from "../src/types";
import { createPusoyRules } from "../src/settler";
import { Natural } from "../src/const";
import { strictEqual } from "assert";
import { assert } from "console";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: [
        {
            name: Natural.Dragon,
            units: 13,
        },
        {
            name: Natural.SixPairs,
            units: 3,
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

const dataTest = [
    {
        case: "Case 2024.0624.1602",
        input: [
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
        ],
        output: [-27, -1, 27, 1],
    },
    {
        case: "Case 2024.0624.1626",
        input: [
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
        ],
        output: [9, -1, -3, -5],
    },
    {
        case: "Case 2024.0628.1620",
        input: [
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
        ],
        output: [-18, 0, 16, 2],
    },
    {
        case: "Case 2024.0701.1647",
        input: [
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
        ],
        output: [-18, 8, -1, 11],
    },
    {
        case: "Case 2024.0701.1647",
        input: [
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
        ],
        output: [-18, 8, -1, 11],
    },
    {
        case: "Case 2024.0705.1614",
        input: [
            {
                front: [49, 38, 34],
                middle: [25, 21, 19, 12, 10],
                back: [39, 35, 28, 27, 20],
            },
            {
                front: [41, 36, 9],
                middle: [8, 15, 4, 1, 16],
                back: [2, 6, 22, 50, 30],
            },
            {
                front: [42, 37, 51],
                middle: [5, 31, 11, 7, 29],
                back: [47, 0, 3, 46, 44],
            },
            {
                front: [48, 40, 43],
                middle: [45, 24, 26, 18, 17],
                back: [14, 33, 13, 23, 32],
            },
        ],
        output: [1, -1, 3, -3],
    },
    {
        case: "Case 2024.0618.2046",
        input: [
            {
                front: [18, 16, 5],
                middle: [47, 44, 39, 15, 1],
                back: [48, 32, 4, 8, 12],
            },
            {
                front: [42, 40, 3],
                middle: [28, 35, 33, 38, 36],
                back: [21, 20, 24, 27, 30],
            },
            {
                front: [11, 9, 37],
                middle: [51, 49, 23, 17, 0],
                back: [46, 26, 22, 14, 2],
            },
            {
                front: [50, 43, 34],
                middle: [7, 6, 31, 19, 10],
                back: [41, 45, 25, 29, 13],
            },
        ],
        output: [4, 9, -3, -10],
    },
    {
        case: "Case 2024.0617.1359",
        input: [
            {
                front: [6, 9, 15],
                middle: [11, 12, 19, 20, 27],
                back: [35, 36, 40, 47, 49],
            },
            {
                front: [46, 45, 41],
                middle: [50, 42, 38, 18, 2],
                back: [30, 29, 28, 7, 5],
            },
            {
                front: [44, 34, 22],
                middle: [13, 10, 4, 1, 51],
                back: [24, 23, 16, 14, 8],
            },
            {
                front: [3, 0, 48],
                middle: [43, 39, 32, 31, 26],
                back: [37, 33, 25, 21, 17],
            },
        ],
        output: [9, 9, -15, -3],
    },
    {
        case: "Case 2024.0703.1509",
        input: [
            {
                front: [26, 25, 24],
                middle: [33, 37, 41, 45, 49],
                back: [32, 36, 40, 44, 48],
            },
            {
                front: [20, 22, 27],
                middle: [16, 12, 8, 4, 0],
                back: [18, 14, 10, 6, 2],
            },
            {
                front: [23, 21, 28],
                middle: [1, 5, 9, 13, 17],
                back: [19, 15, 11, 7, 3],
            },
            {
                front: [31, 30, 29],
                middle: [34, 38, 42, 46, 50],
                back: [35, 39, 43, 47, 51],
            },
        ],
        output: [39, -39, -117, 117],
    },
    {
        case: "Case 2024.0703.1511",
        input: [
            {
                front: [26, 25, 24],
                middle: [33, 37, 41, 45, 49],
                back: [32, 36, 40, 44, 48],
            },
            {
                front: [23, 21, 28],
                middle: [16, 12, 8, 4, 0],
                back: [18, 14, 10, 6, 2],
            },
            {
                front: [20, 22, 27],
                middle: [1, 5, 9, 13, 17],
                back: [19, 15, 11, 7, 3],
            },
            {
                front: [31, 30, 29],
                middle: [34, 38, 42, 46, 50],
                back: [35, 39, 43, 47, 51],
            },
        ],
        output: [39, -49, -107, 117],
    },
    {
        case: "Case 2024.0718.1507",
        input: [
            {
                front: [28, 30, 51],
                middle: [26, 25, 38, 33, 4],
                back: [21, 20, 14, 15, 1],
            },
            {
                front: [47, 44, 49],
                middle: [41, 40, 34, 31, 27],
                back: [19, 17, 3, 2, 9],
            },
            {
                front: [11, 8, 45],
                middle: [39, 36, 32, 12, 5],
                back: [50, 42, 22, 18, 6],
            },
            {
                front: [0, 7, 10],
                middle: [13, 16, 23, 24, 29],
                back: [35, 37, 43, 46, 48],
            },
        ],
        output: [-12, -12, -1, 25],
    },
    {
        case: "Case 2024.0718.1558",
        input: [
            {
                front: [26, 25, 51],
                middle: [28, 30, 38, 33, 4],
                back: [21, 20, 14, 15, 1],
            },
            {
                front: [41, 40, 49],
                middle: [47, 44, 34, 31, 27],
                back: [19, 17, 3, 2, 9],
            },
            {
                front: [11, 8, 45],
                middle: [39, 36, 32, 12, 5],
                back: [50, 42, 22, 18, 6],
            },
            {
                front: [0, 7, 10],
                middle: [13, 16, 23, 24, 29],
                back: [35, 37, 43, 46, 48],
            },
        ],
        output: [-15, -11, -13, 39],
    },
    {
        case: "Case 2024.0718.1525",
        input: [
            {
                front: [44, 32, 33],
                middle: [11, 4, 40, 51, 50],
                back: [17, 21, 25, 28, 34],
            },
            {
                front: [2, 0, 35],
                middle: [12, 13, 22, 23, 26],
                back: [24, 42, 41, 47, 46],
            },
            {
                front: [45, 43, 49],
                middle: [31, 27, 7, 6, 5],
                back: [8, 10, 9, 16, 20],
            },
            {
                front: [3, 1, 48],
                middle: [14, 15, 18, 19, 30],
                back: [29, 39, 38, 37, 36],
            },
        ],
        output: [-5, 9, -7, 3],
    },
    {
        case: "Case 2024.0718.1605",
        input: [
            {
                front: [44, 32, 33],
                middle: [11, 4, 40, 51, 50],
                back: [17, 21, 25, 28, 34],
            },
            {
                front: [2, 0, 35],
                middle: [12, 13, 22, 23, 26],
                back: [24, 42, 41, 47, 46],
            },
            {
                front: [45, 43, 49],
                middle: [31, 27, 8, 10, 9],
                back: [7, 6, 5, 16, 20],
            },
            {
                front: [3, 1, 48],
                middle: [14, 15, 18, 19, 30],
                back: [29, 39, 38, 37, 36],
            },
        ],
        output: [0, 12, -18, 6],
    },
    {
        case: "Case 2024.0718.1539",
        input: [
            {
                front: [51, 44, 41],
                middle: [31, 26, 20, 19, 14],
                back: [33, 28, 27, 21, 17],
            },
            {
                front: [1, 0, 7],
                middle: [25, 30, 32, 39, 40],
                back: [22, 34, 38, 42, 50],
            },
            {
                front: [5, 8, 12],
                middle: [48, 2, 4, 9, 13],
                back: [3, 6, 10, 15, 18],
            },
            {
                front: [43, 49, 11],
                middle: [29, 24, 23, 16, 35],
                back: [37, 36, 46, 47, 45],
            },
        ],
        output: [9, -5, 3, -7],
    },
    {
        case: "Case 2024.0718.1621",
        input: [
            {
                front: [51, 46, 37],
                middle: [1, 3, 25, 21, 14],
                back: [32, 36, 40, 24, 28],
            },
            {
                front: [31, 27, 19],
                middle: [30, 18, 10, 6, 2],
                back: [41, 33, 13, 9, 5],
            },
            {
                front: [12, 8, 0],
                middle: [47, 43, 35, 23, 11],
                back: [34, 38, 42, 22, 50],
            },
            {
                front: [39, 49, 48],
                middle: [44, 45, 16, 7, 4],
                back: [29, 26, 20, 17, 15],
            },
        ],
        output: [-3, 3, 9, -9],
    },
    {
        case: "Case 2024.0719.1734",
        input: [
            {
                front: [37, 39, 28],
                middle: [46, 44, 16, 25, 11],
                back: [35, 33, 2, 1, 6],
            },
            {
                front: [20, 22, 41],
                middle: [50, 49, 9, 13, 26],
                back: [7, 15, 31, 19, 43],
            },
            {
                front: [0, 5, 8],
                middle: [14, 17, 21, 24, 29],
                back: [32, 36, 42, 47, 48],
            },
            {
                front: [3, 4, 10],
                middle: [12, 18, 23, 27, 30],
                back: [34, 38, 40, 45, 51],
            },
        ],
        output: [-27, -25, 13, 39],
    },
    {
        case: "Case 2024.0719.1754",
        input: [
            {
                front: [39, 36, 50],
                middle: [19, 22, 32, 47, 46],
                back: [5, 24, 26, 11, 10],
            },
            {
                front: [1, 2, 48],
                middle: [12, 14, 18, 17, 21],
                back: [23, 30, 29, 40, 42],
            },
            {
                front: [4, 3, 51],
                middle: [0, 6, 9, 15, 16],
                back: [31, 34, 37, 43, 45],
            },
            {
                front: [8, 7, 44],
                middle: [20, 27, 28, 35, 38],
                back: [13, 25, 33, 41, 49],
            },
        ],
        output: [-7, 3, 9, -5],
    },
    {
        case: "Case 2024.0719.1805",
        input: [
            {
                front: [37, 38, 44],
                middle: [32, 17, 20, 51, 50],
                back: [9, 4, 5, 28, 29],
            },
            {
                front: [1, 2, 48],
                middle: [10, 11, 26, 24, 21],
                back: [23, 40, 42, 46, 47],
            },
            {
                front: [14, 18, 34],
                middle: [15, 19, 31, 39, 43],
                back: [13, 25, 33, 41, 49],
            },
            {
                front: [3, 7, 45],
                middle: [0, 6, 8, 12, 16],
                back: [35, 27, 30, 22, 36],
            },
        ],
        output: [-7, 3, 9, -5],
    },
    {
        case: "Case 2024.0722.1402",
        input: [
            {
                front: [3, 19, 31],
                middle: [13, 21, 29, 37, 49],
                back: [20, 36, 40, 44, 48],
            },
            {
                front: [38, 41, 47],
                middle: [30, 28, 17, 7, 2],
                back: [12, 15, 24, 25, 26],
            },
            {
                front: [43, 46, 51],
                middle: [9, 11, 8, 0, 1],
                back: [34, 33, 35, 6, 5],
            },
            {
                front: [16, 23, 27],
                middle: [4, 10, 14, 18, 22],
                back: [32, 39, 42, 45, 50],
            },
        ],
        output: [9, -12, 0, 3],
    },
    {
        case: "Case 2024.0722.1421",
        input: [
            {
                front: [3, 46, 31],
                middle: [13, 21, 29, 37, 49],
                back: [20, 36, 40, 44, 48],
            },
            {
                front: [38, 41, 43],
                middle: [30, 28, 7, 15, 12],
                back: [2, 27, 24, 25, 26],
            },
            {
                front: [16, 19, 17],
                middle: [9, 11, 8, 10, 1],
                back: [34, 33, 35, 32, 5],
            },
            {
                front: [47, 45, 39],
                middle: [4, 0, 51, 50, 23],
                back: [6, 14, 18, 22, 42],
            },
        ],
        output: [-24, -13, 63, -26],
    },
    {
        case: "Case 2024.0722.1450",
        input: [
            {
                front: [27, 25, 40],
                middle: [0, 9, 13, 35, 33],
                back: [10, 14, 38, 42, 50],
            },
            {
                front: [21, 20, 22],
                middle: [2, 3, 1, 7, 5],
                back: [51, 49, 48, 39, 36],
            },
            {
                front: [29, 18, 19],
                middle: [15, 8, 11, 45, 46],
                back: [26, 28, 32, 37, 43],
            },
            {
                front: [30, 31, 41],
                middle: [34, 24, 23, 44, 47],
                back: [12, 4, 6, 17, 16],
            },
        ],
        output: [-24, -13, 63, -26],
    },
    {
        case: "Case 2024.0726.1801",
        input: [
            {
                front: [12, 49, 51],
                middle: [4, 35, 33, 38, 37],
                back: [31, 28, 40, 43, 42],
            },
            {
                front: [34, 36, 50],
                middle: [1, 10, 23, 5, 6],
                back: [17, 20, 27, 29, 32],
            },
            {
                front: [41, 8, 11],
                middle: [25, 30, 39, 14, 13],
                back: [0, 2, 44, 46, 47],
            },
            {
                front: [45, 26, 24],
                middle: [48, 3, 7, 9, 15],
                back: [22, 21, 16, 18, 19],
            },
        ],
        output: [8, -18, 4, 6],
    },
];

dataTest.forEach((data) => {
    test(`${data.case}`, () => {
        // Act
        const output = pusoy.settle(data.input);
        const actual = output.map((s) => s.sum);

        // Assert
        if (JSON.stringify(actual) !== JSON.stringify(data.output)) {
            throw new Error(
                `expected ${data.output} but got ${actual} \n ${JSON.stringify(
                    output,
                    null,
                    2,
                )} \n`,
            );
        }
    });
});
