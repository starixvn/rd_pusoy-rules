import { HandTypeRank, initScoreConfig, initSettlement } from "../const";
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
                mini: 3,
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
                                    type: HandTypeRank.HighCard,
                                    suit: 0,
                                    rank: 1,
                                },
                                middle: {
                                    type: HandTypeRank.Straight,
                                    suit: 0,
                                    rank: 1,
                                },
                                back: {
                                    type: HandTypeRank.Flush,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            1,
                            {
                                front: {
                                    type: HandTypeRank.HighCard,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandTypeRank.TwoPairs,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandTypeRank.Flush,
                                    suit: 0,
                                    rank: 1,
                                },
                            },
                        ],
                        [
                            2,
                            {
                                front: {
                                    type: HandTypeRank.ThreeOfAKind,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandTypeRank.ThreeOfAKind,
                                    suit: 2,
                                    rank: 1,
                                },
                                back: {
                                    type: HandTypeRank.Straight,
                                    suit: 1,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            3,
                            {
                                front: {
                                    type: HandTypeRank.HighCard,
                                    suit: 2,
                                    rank: 3,
                                },
                                middle: {
                                    type: HandTypeRank.Straight,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandTypeRank.FullHouse,
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
                                    name: "",
                                    units: -4,
                                },
                                middle: {
                                    name: "",
                                    units: 0,
                                },
                                back: {
                                    name: "",
                                    units: 0,
                                },
                            },
                            pusoy: {
                                mini: {},
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
                                    name: "",
                                    units: -4,
                                },
                                middle: {
                                    name: "",
                                    units: 0,
                                },
                                back: {
                                    name: "",
                                    units: 0,
                                },
                            },
                            pusoy: {
                                mini: {
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
                                    name: "threeOfAKind",
                                    units: 12,
                                },
                                middle: {
                                    name: "",
                                    units: 0,
                                },
                                back: {
                                    name: "",
                                    units: 0,
                                },
                            },
                            pusoy: {
                                mini: {},
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
                                    name: "",
                                    units: -4,
                                },
                                middle: {
                                    name: "",
                                    units: 0,
                                },
                                back: {
                                    name: "",
                                    units: 0,
                                },
                            },
                            pusoy: {
                                mini: {
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
                                    type: HandTypeRank.OnePair,
                                    suit: 2,
                                    rank: 1,
                                },
                                middle: {
                                    type: HandTypeRank.Straight,
                                    suit: 0,
                                    rank: 1,
                                },
                                back: {
                                    type: HandTypeRank.Flush,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            1,
                            {
                                front: {
                                    type: HandTypeRank.HighCard,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandTypeRank.TwoPairs,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandTypeRank.Flush,
                                    suit: 0,
                                    rank: 1,
                                },
                            },
                        ],
                        [
                            2,
                            {
                                front: {
                                    type: HandTypeRank.OnePair,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandTypeRank.ThreeOfAKind,
                                    suit: 2,
                                    rank: 1,
                                },
                                back: {
                                    type: HandTypeRank.Straight,
                                    suit: 1,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            3,
                            {
                                front: {
                                    type: HandTypeRank.OnePair,
                                    suit: 4,
                                    rank: 5,
                                },
                                middle: {
                                    type: HandTypeRank.Straight,
                                    suit: 0,
                                    rank: 3,
                                },
                                back: {
                                    type: HandTypeRank.FullHouse,
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
                            pusoy: {
                                mini: {
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
                            pusoy: {
                                mini: {
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
                            pusoy: {
                                mini: {
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
                            pusoy: {
                                mini: {},
                                full: 18,
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
                                    type: HandTypeRank.OnePair,
                                    suit: 2,
                                    rank: 1,
                                },
                                middle: {
                                    type: HandTypeRank.StraightFlush,
                                    suit: 0,
                                    rank: 1,
                                },
                                back: {
                                    type: HandTypeRank.RoyalFlush,
                                    suit: 0,
                                    rank: 0,
                                },
                            },
                        ],
                        [
                            1,
                            {
                                front: {
                                    type: HandTypeRank.ThreeOfAKind,
                                    suit: 0,
                                    rank: 0,
                                },
                                middle: {
                                    type: HandTypeRank.TwoPairs,
                                    suit: 0,
                                    rank: 0,
                                },
                                back: {
                                    type: HandTypeRank.Flush,
                                    suit: 0,
                                    rank: 1,
                                },
                            },
                        ],
                    ]),
                    scoreConfig,
                    numberOfPlayer: 2,
                },
                new Map([
                    [
                        0,
                        {
                            ...initSettlement,
                            normal: {
                                front: 0,
                                middle: 0,
                                back: 0,
                            },
                            royalty: {
                                front: {
                                    name: "",
                                    units: -4,
                                },
                                middle: {
                                    name: "straightFlush",
                                    units: 5,
                                },
                                back: {
                                    name: "royalFlush",
                                    units: 8,
                                },
                            },
                        },
                    ],
                    [
                        1,
                        {
                            ...initSettlement,
                            normal: {
                                front: 0,
                                middle: 0,
                                back: 0,
                            },
                            royalty: {
                                front: {
                                    name: "threeOfAKind",
                                    units: 4,
                                },
                                middle: {
                                    name: "",
                                    units: -5,
                                },
                                back: {
                                    name: "",
                                    units: -8,
                                },
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
                                type: HandTypeRank.OnePair,
                                suit: 2,
                                rank: 1,
                            },
                            middle: {
                                type: HandTypeRank.Straight,
                                suit: 0,
                                rank: 1,
                            },
                            back: {
                                type: HandTypeRank.Flush,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            front: {
                                type: HandTypeRank.HighCard,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandTypeRank.TwoPairs,
                                suit: 0,
                                rank: 0,
                            },
                            back: {
                                type: HandTypeRank.Flush,
                                suit: 0,
                                rank: 1,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            front: {
                                type: HandTypeRank.OnePair,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandTypeRank.ThreeOfAKind,
                                suit: 2,
                                rank: 1,
                            },
                            back: {
                                type: HandTypeRank.Straight,
                                suit: 1,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            front: {
                                type: HandTypeRank.OnePair,
                                suit: 4,
                                rank: 5,
                            },
                            middle: {
                                type: HandTypeRank.Straight,
                                suit: 0,
                                rank: 3,
                            },
                            back: {
                                type: HandTypeRank.FullHouse,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                ]),
                scoreConfig: {
                    ...initScoreConfig,
                    pusoy: {
                        mini: 3,
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
                                type: HandTypeRank.OnePair,
                                suit: 2,
                                rank: 1,
                            },
                            middle: {
                                type: HandTypeRank.Straight,
                                suit: 0,
                                rank: 1,
                            },
                            back: {
                                type: HandTypeRank.Flush,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        1,
                        {
                            front: {
                                type: HandTypeRank.HighCard,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandTypeRank.TwoPairs,
                                suit: 0,
                                rank: 0,
                            },
                            back: {
                                type: HandTypeRank.Flush,
                                suit: 0,
                                rank: 1,
                            },
                        },
                    ],
                    [
                        2,
                        {
                            front: {
                                type: HandTypeRank.OnePair,
                                suit: 0,
                                rank: 0,
                            },
                            middle: {
                                type: HandTypeRank.ThreeOfAKind,
                                suit: 2,
                                rank: 1,
                            },
                            back: {
                                type: HandTypeRank.Straight,
                                suit: 1,
                                rank: 0,
                            },
                        },
                    ],
                    [
                        3,
                        {
                            front: {
                                type: HandTypeRank.OnePair,
                                suit: 4,
                                rank: 5,
                            },
                            middle: {
                                type: HandTypeRank.Straight,
                                suit: 0,
                                rank: 3,
                            },
                            back: {
                                type: HandTypeRank.FullHouse,
                                suit: 0,
                                rank: 0,
                            },
                        },
                    ],
                ]),
                scoreConfig: {
                    ...initScoreConfig,
                    pusoy: {
                        mini: 3,
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
