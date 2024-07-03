import { assert } from "console";
import { HandType, initScoreConfig, initSettlement } from "../const";
import { compareHands } from "./compare-hands";

describe(compareHands.name, () => {
    describe("winner take all enable", () => {
        const scoreConfig = {
            ...initScoreConfig,
            normal: 1,
            royalty: {
                front: {
                    threeOfAKind: 4,
                },
                middle: {
                    straightFlush: 5,
                },
                back: {
                    royalFlush: 8,
                },
            },
            pusoy: {
                partial: 3,
                full: {
                    isWinnerTakeAll: true,
                    units: 6,
                },
            },
        };

        test.each([
            [
                {
                    compareHandPlayers: new Map([
                        [
                            0,
                            {
                                front: {
                                    type: HandType.HighCard,
                                    suit: 0,
                                    rank: 1,
                                },
                                middle: {
                                    type: HandType.Straight,
                                    suit: 0,
                                    rank: 1,
                                },
                                back: {
                                    type: HandType.Flush,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            1,
                            {
                                front: {
                                    type: HandType.HighCard,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandType.TwoPairs,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandType.Flush,
                                    suit: 0,
                                    rank: 1,
                                },
                            },
                        ],
                        [
                            2,
                            {
                                front: {
                                    type: HandType.ThreeOfAKind,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandType.ThreeOfAKind,
                                    suit: 2,
                                    rank: 1,
                                },
                                back: {
                                    type: HandType.Straight,
                                    suit: 1,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            3,
                            {
                                front: {
                                    type: HandType.HighCard,
                                    suit: 2,
                                    rank: 3,
                                },
                                middle: {
                                    type: HandType.Straight,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandType.FullHouse,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                    ]),
                    scoreConfig,
                    numberOfPlayer: 4,
                },
                new Map([
                    [
                        0,
                        {
                            ...initSettlement,
                            normal: {
                                front: 0,
                                middle: 3,
                                back: -1,
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -4,
                                },
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {},
                                full: 0,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            ...initSettlement,
                            normal: {
                                front: -2,
                                middle: -3,
                                back: 1,
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -4,
                                },
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {
                                    "3": -3,
                                },
                                full: 0,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            ...initSettlement,
                            normal: {
                                front: 0,
                                middle: -1,
                                back: -3,
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: 12,
                                },
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {},
                                full: 0,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            ...initSettlement,
                            normal: {
                                front: 2,
                                middle: 1,
                                back: 3,
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -4,
                                },
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {
                                    "1": 3,
                                },
                                full: 0,
                            },
                        },
                    ],
                ]),
            ],
            [
                {
                    compareHandPlayers: new Map([
                        [
                            0,
                            {
                                front: {
                                    type: HandType.OnePair,
                                    suit: 2,
                                    rank: 1,
                                },
                                middle: {
                                    type: HandType.Straight,
                                    suit: 0,
                                    rank: 1,
                                },
                                back: {
                                    type: HandType.Flush,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            1,
                            {
                                front: {
                                    type: HandType.HighCard,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandType.TwoPairs,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandType.Flush,
                                    suit: 0,
                                    rank: 1,
                                },
                            },
                        ],
                        [
                            2,
                            {
                                front: {
                                    type: HandType.OnePair,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandType.ThreeOfAKind,
                                    suit: 2,
                                    rank: 1,
                                },
                                back: {
                                    type: HandType.Straight,
                                    suit: 1,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            3,
                            {
                                front: {
                                    type: HandType.OnePair,
                                    suit: 4,
                                    rank: 5,
                                },
                                middle: {
                                    type: HandType.Straight,
                                    suit: 0,
                                    rank: 3,
                                },
                                back: {
                                    type: HandType.FullHouse,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                    ]),
                    scoreConfig,
                    numberOfPlayer: 4,
                },
                new Map([
                    [
                        0,
                        {
                            ...initSettlement,
                            normal: {
                                front: 1,
                                middle: 1,
                                back: -1,
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {
                                    "2": 3,
                                    "3": 0,
                                },
                                full: -3,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            ...initSettlement,
                            normal: {
                                front: -3,
                                middle: -3,
                                back: 1,
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {
                                    "3": 0,
                                },
                                full: -6,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            ...initSettlement,
                            normal: {
                                front: -1,
                                middle: -1,
                                back: -3,
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {
                                    "0": -3,
                                    "3": 0,
                                },
                                full: -9,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            ...initSettlement,
                            normal: {
                                front: 3,
                                middle: 3,
                                back: 3,
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            pusoy: {
                                partial: {},
                                full: 18,
                            },
                        },
                    ],
                ]),
            ],
        ])("preprocessData %o should return %o", (preprocessData, expected) => {
            const actual = compareHands(new Map(), preprocessData);

            expect(actual).toStrictEqual(expected);
        });
    });
    describe("winner take all disable", () => {
        it("should return same pusoy score with all player lose", () => {
            // Arrange
            const preprocessData = {
                compareHandPlayers: new Map([
                    [
                        0,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 2,
                                rank: 1,
                            },
                            middle: {
                                type: HandType.Straight,
                                suit: 0,
                                rank: 1,
                            },
                            back: {
                                type: HandType.Flush,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            front: {
                                type: HandType.HighCard,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandType.TwoPairs,
                                suit: 0,
                                rank: 0,
                            },
                            back: {
                                type: HandType.Flush,
                                suit: 0,
                                rank: 1,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandType.ThreeOfAKind,
                                suit: 2,
                                rank: 1,
                            },
                            back: {
                                type: HandType.Straight,
                                suit: 1,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 4,
                                rank: 5,
                            },
                            middle: {
                                type: HandType.Straight,
                                suit: 0,
                                rank: 3,
                            },
                            back: {
                                type: HandType.FullHouse,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                ]),
                scoreConfig: {
                    ...initScoreConfig,
                    pusoy: {
                        partial: 3,
                        full: {
                            isWinnerTakeAll: false,
                            units: 6,
                        },
                    },
                },
                numberOfPlayer: 4,
            };

            //Act
            const actual = compareHands(new Map(), preprocessData);

            //Assert
            expect(actual.get(3)!.pusoy.full).toBe(18);
            expect(actual.get(0)!.pusoy.full).toBe(-6);
            expect(actual.get(1)!.pusoy.full).toBe(-6);
            expect(actual.get(2)!.pusoy.full).toBe(-6);
        });
    });
    describe("turn off full pusoy", () => {
        it("should return same pusoy score with all player lose", () => {
            // Arrange
            const preprocessData = {
                compareHandPlayers: new Map([
                    [
                        0,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 2,
                                rank: 1,
                            },
                            middle: {
                                type: HandType.Straight,
                                suit: 0,
                                rank: 1,
                            },
                            back: {
                                type: HandType.Flush,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            front: {
                                type: HandType.HighCard,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandType.TwoPairs,
                                suit: 0,
                                rank: 0,
                            },
                            back: {
                                type: HandType.Flush,
                                suit: 0,
                                rank: 1,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandType.ThreeOfAKind,
                                suit: 2,
                                rank: 1,
                            },
                            back: {
                                type: HandType.Straight,
                                suit: 1,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            front: {
                                type: HandType.OnePair,
                                suit: 4,
                                rank: 5,
                            },
                            middle: {
                                type: HandType.Straight,
                                suit: 0,
                                rank: 3,
                            },
                            back: {
                                type: HandType.FullHouse,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                ]),
                scoreConfig: {
                    ...initScoreConfig,
                    pusoy: {
                        partial: 3,
                        full: {
                            isWinnerTakeAll: false,
                            units: 0,
                        },
                    },
                },
                numberOfPlayer: 4,
            };

            //Act
            const actual = compareHands(new Map(), preprocessData);

            //Assert
            expect(actual.get(3)!.pusoy.full).toBe(0);
            expect(actual.get(0)!.pusoy.full).toBe(0);
            expect(actual.get(1)!.pusoy.full).toBe(0);
            expect(actual.get(2)!.pusoy.full).toBe(0);
        });
    });
    describe("have one player compare hand", () => {
        it("should return current result", () => {
            // Arrange
            const currentResult = new Map();

            // Act
            const actual = compareHands(currentResult, {
                compareHandPlayers: new Map(),
                numberOfPlayer: 1,
                scoreConfig: initScoreConfig,
            });

            // Assert
            expect(actual).toStrictEqual(currentResult);
        });
    });
});
