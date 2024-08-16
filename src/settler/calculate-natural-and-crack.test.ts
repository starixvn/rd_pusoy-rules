import { Natural, initScoreConfig, initSettlement } from "../const";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";

describe(calculateNaturalAndCrack.name, () => {
    test.each([
        [
            {
                naturalPlayers: new Map([
                    [
                        1,
                        {
                            type: 5,
                            rank: 0,
                            suit: 0,
                            name: Natural.Dragon,
                            units: 3,
                        },
                    ],
                    [
                        2,
                        {
                            type: 5,
                            rank: 2,
                            suit: 0,
                            name: Natural.Dragon,
                            units: 3,
                        },
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
                        crack: { isCrack: true, units: -9 },
                        natural: {
                            name: "",
                            units: 0,
                        },
                    },
                ],
                [
                    1,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "dragon",
                            units: 0,
                        },
                    },
                ],
                [
                    2,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "dragon",
                            units: 6,
                        },
                    },
                ],
                [
                    3,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "",
                            units: -6,
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
                            name: Natural.Dragon,
                            units: 8,
                        },
                    ],
                    [
                        1,
                        {
                            type: 4,
                            rank: 2,
                            suit: 0,
                            name: Natural.SixPairs,
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
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "dragon",
                            units: 16,
                        },
                    },
                ],
                [
                    1,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "sixPairs",
                            units: -3,
                        },
                    },
                ],
                [
                    2,
                    {
                        ...initSettlement,
                        crack: { isCrack: true, units: -9 },
                        natural: {
                            name: "",
                            units: 0,
                        },
                    },
                ],
                [
                    3,
                    {
                        ...initSettlement,
                        crack: { isCrack: false, units: 3 },
                        natural: {
                            name: "",
                            units: -13,
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
