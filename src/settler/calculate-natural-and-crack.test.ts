import { NaturalDisplay, NaturalType } from "../const";
import { initScoreConfig, initSettlement } from "../helper/initializer";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";

describe(calculateNaturalAndCrack.name, () => {
    test.each([
        [
            new Map(),
            {
                naturalPlayers: new Map([
                    [1, { type: NaturalType.Dragon, rank: 0, suit: 0 }],
                    [2, { type: NaturalType.Dragon, rank: 2, suit: 0 }],
                ]),
                crackPlayers: new Set([0]),
                numberOfPlayer: 4,
                scoreConfig: {
                    ...initScoreConfig,
                    crack: 3,
                    natural: {
                        dragon: 3,
                    },
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
    ])(
        "preprocessData %o should return %o",
        (currentResult, data, expected) => {
            const actual = calculateNaturalAndCrack(currentResult, data);

            expect(actual).toStrictEqual(expected);
        },
    );
});
