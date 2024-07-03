import { settle } from "./settle";
import {
    calculateNaturalScore,
    calculateSegmentScore,
    isCrack,
} from "../scorer";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";
import { compareHands } from "./compare-hands";
import { PlayerData } from "../types";
import { Natural, initScoreConfig, initSettlement } from "../const";
import { isThreeOfAKind } from "../scorer/hands";

const calculateNaturalScoreMock = calculateNaturalScore as jest.Mock;
const calculateSegmentScoreMock = calculateSegmentScore as jest.Mock;
const isCrackMock = isCrack as jest.Mock;
const calculateNaturalAndCrackMock = calculateNaturalAndCrack as jest.Mock;
const compareHandsMock = compareHands as jest.Mock;

jest.mock("../scorer");
jest.mock("./calculate-natural-and-crack");
jest.mock("./compare-hands");

describe(settle.name, () => {
    describe("when have 2 players alert natural", () => {
        describe("and they are not crack", () => {
            it("should call calculate natural score 2 times", () => {
                // Arrange
                const p0: PlayerData = {
                    hand: { front: [0], middle: [0], back: [0] },
                    isAlertNatural: true,
                };
                const p1: PlayerData = {
                    hand: { front: [0], middle: [0], back: [0] },
                    isAlertNatural: false,
                };
                calculateNaturalScoreMock.mockReturnValue({
                    name: Natural.Unknown,
                });

                // Act
                settle([p0, p0, p1], initScoreConfig);

                // Assert
                expect(calculateNaturalScoreMock).toHaveBeenCalledTimes(2);
            });
        });

        describe("and they are crack", () => {
            it("should not call calculate natural score", () => {
                // Arrange
                const p0: PlayerData = {
                    hand: { front: [0], middle: [0], back: [0] },
                    isAlertNatural: true,
                };
                const p1: PlayerData = {
                    hand: { front: [0], middle: [0], back: [0] },
                    isAlertNatural: false,
                };
                isCrackMock.mockReturnValue(true);

                // Act
                settle([p0, p0, p1], initScoreConfig);

                // Assert
                expect(calculateNaturalScoreMock).toHaveBeenCalledTimes(0);
            });
        });
    });
    describe("when have all player alert natural and they have natural", () => {
        it("should call call calculate natural and crack with all player", () => {
            // Arrange
            const p0: PlayerData = {
                hand: { front: [0], middle: [0], back: [0] },
                isAlertNatural: true,
            };
            calculateNaturalScoreMock.mockReturnValue({
                name: Natural.Dragon,
            });
            isCrackMock.mockReturnValue(false);

            // Act
            settle([p0, p0, p0], initScoreConfig);

            // Assert
            expect(calculateNaturalAndCrackMock).toHaveBeenCalledWith(
                new Map(),
                {
                    compareHandPlayers: new Map(),
                    naturalPlayers: new Map([
                        [0, { name: Natural.Dragon }],
                        [1, { name: Natural.Dragon }],
                        [2, { name: Natural.Dragon }],
                    ]),
                    crackPlayers: new Set(),
                    numberOfPlayer: 3,
                    scoreConfig: initScoreConfig,
                },
            );
        });
    });
    describe("after calculate natural, crack and compare hand", () => {
        test.each([
            [
                new Map([
                    [
                        0,
                        {
                            crack: {
                                isCrack: true,
                                score: -9,
                            },
                            natural: {
                                dragon: -5,
                            },
                            normal: {
                                front: 0,
                                middle: 0,
                                back: 0,
                            },
                            pusoy: {
                                full: 0,
                                partial: {},
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            sum: 0,
                        },
                    ],
                    [
                        1,
                        {
                            crack: {
                                isCrack: false,
                                score: 3,
                            },
                            natural: {
                                dragon: 15,
                            },
                            normal: {
                                front: 0,
                                middle: 0,
                                back: 0,
                            },
                            pusoy: {
                                full: 0,
                                partial: {},
                            },
                            royalty: {
                                front: {},
                                middle: {},
                                back: {},
                            },
                            sum: 0,
                        },
                    ],
                    [
                        2,
                        {
                            crack: {
                                isCrack: false,
                                score: 3,
                            },
                            natural: {
                                dragon: -5,
                            },
                            normal: {
                                front: 1,
                                middle: 0,
                                back: -1,
                            },
                            pusoy: {
                                full: 0,
                                partial: {},
                            },
                            royalty: {
                                front: {},
                                middle: {
                                    royalFlush: -3,
                                },
                                back: {},
                            },
                            sum: 0,
                        },
                    ],
                    [
                        3,
                        {
                            crack: {
                                isCrack: false,
                                score: 3,
                            },
                            natural: {
                                dragon: -5,
                            },
                            normal: {
                                front: -1,
                                middle: 0,
                                back: 1,
                            },
                            pusoy: {
                                full: 0,
                                partial: {},
                            },
                            royalty: {
                                front: {},
                                middle: {
                                    royalFlush: 3,
                                },
                                back: {},
                            },
                            sum: 0,
                        },
                    ],
                ]),
                [-14, 18, -5, 1],
            ],
            [
                new Map([
                    [
                        0,
                        {
                            crack: {
                                isCrack: false,
                                score: 0,
                            },
                            natural: {},
                            normal: {
                                front: 0,
                                middle: 0,
                                back: 0,
                            },
                            pusoy: {
                                full: 18,
                                partial: {},
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: 9,
                                },
                                middle: {
                                    royalFlush: 15,
                                },
                                back: {
                                    royalFlush: 12,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        1,
                        {
                            crack: {
                                isCrack: false,
                                score: 0,
                            },
                            natural: {},
                            normal: {
                                front: 2,
                                middle: 0,
                                back: 0,
                            },
                            pusoy: {
                                full: -3,
                                partial: {
                                    "2": 3,
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -3,
                                },
                                middle: {
                                    royalFlush: -5,
                                },
                                back: {
                                    royalFlush: -4,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        2,
                        {
                            crack: {
                                isCrack: false,
                                score: 0,
                            },
                            natural: {},
                            normal: {
                                front: 0,
                                middle: -2,
                                back: -2,
                            },
                            pusoy: {
                                full: -9,
                                partial: {
                                    "1": -3,
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -3,
                                },
                                middle: {
                                    royalFlush: -5,
                                },
                                back: {
                                    royalFlush: -4,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        3,
                        {
                            crack: {
                                isCrack: false,
                                score: 0,
                            },
                            natural: {},
                            normal: {
                                front: -2,
                                middle: 2,
                                back: 2,
                            },
                            pusoy: {
                                full: -6,
                                partial: {
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    threeOfAKind: -3,
                                },
                                middle: {
                                    royalFlush: -5,
                                },
                                back: {
                                    royalFlush: -4,
                                },
                            },
                            sum: 0,
                        },
                    ],
                ]),
                [54, -10, -28, -16],
            ],
        ])(
            "with settlement %o after all stage should return sum of settlement as %o",
            (settlement, expected) => {
                // Arrange
                const p0: PlayerData = {
                    hand: { front: [0], middle: [0], back: [0] },
                    isAlertNatural: true,
                };
                compareHandsMock.mockReturnValue(settlement);
                calculateNaturalScoreMock.mockReturnValue({
                    name: Natural.Unknown,
                });

                // Act
                const actual = settle([p0, p0, p0], initScoreConfig);

                // Assert
                const sum = actual.map((s) => s.sum);
                expect(sum).toEqual(expected);
            },
        );
    });
});
