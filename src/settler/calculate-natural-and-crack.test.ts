import { initScoreConfig, initSettlement } from "../const";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";

describe(calculateNaturalAndCrack.name, () => {
    test.each([
        [
            {
                naturalPlayers: new Map([
                    [
                        1,
                        { type: 5, rank: 0, suit: 0, name: "dragon", units: 3 },
                    ],
                    [
                        2,
                        { type: 5, rank: 2, suit: 0, name: "dragon", units: 3 },
                    ],
                ]),
                crackPlayers: new Set([0]),
                numberOfPlayer: 4,
                scoreConfig: {
                    ...initScoreConfig,
                    crack: 3,
                },
            },
            new Map([
                [
                    0,
                    {
                        ...initSettlement,
                        crack: { isCrack: true, score: -9 },
                        natural: {
                            dragon: -6,
                        },
                    },
                ],
                [
                    1,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: 3,
                        },
                    },
                ],
                [
                    2,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: 9,
                        },
                    },
                ],
                [
                    3,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: -6,
                        },
                    },
                ],
            ]),
        ],
        [
            {
                naturalPlayers: new Map([
                    [
                        0,
                        {
                            type: 5,
                            rank: 2,
                            suit: 0,
                            name: "dragon",
                            units: 8,
                        },
                    ],
                    [
                        1,
                        {
                            type: 4,
                            rank: 2,
                            suit: 0,
                            name: "sixPairs",
                            units: 5,
                        },
                    ],
                ]),
                crackPlayers: new Set([2]),
                numberOfPlayer: 4,
                scoreConfig: {
                    ...initScoreConfig,
                    crack: 3,
                },
            },
            new Map([
                [
                    0,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: 24,
                        },
                    },
                ],
                [
                    1,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: -8,
                            sixPairs: 10,
                        },
                    },
                ],
                [
                    2,
                    {
                        ...initSettlement,
                        crack: { isCrack: true, score: -9 },
                        natural: {
                            dragon: -8,
                            sixPairs: -5,
                        },
                    },
                ],
                [
                    3,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, score: 3 },
                        natural: {
                            dragon: -8,
                            sixPairs: -5,
                        },
                    },
                ],
            ]),
        ],
    ])("preprocessData %o should return %o", (preprocessData, expected) => {
        const actual = calculateNaturalAndCrack(new Map(), preprocessData);

        expect(actual).toStrictEqual(expected);
    });
});
