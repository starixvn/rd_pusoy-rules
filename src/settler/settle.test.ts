import { settle } from "./settle";
import { calculateNaturalScore, isCrack } from "../scorer";
import { calculateNaturalAndCrack } from "./calculate-natural-and-crack";
import { compareHands } from "./compare-hands";
import { Natural, initScoreConfig, initSettlement } from "../const";
import { Hand } from "../types";

const calculateNaturalScoreMock = calculateNaturalScore as jest.Mock;
const isCrackMock = isCrack as jest.Mock;
const calculateNaturalAndCrackMock = calculateNaturalAndCrack as jest.Mock;
const compareHandsMock = compareHands as jest.Mock;

jest.mock("../scorer");
jest.mock("./calculate-natural-and-crack");
jest.mock("./compare-hands");

describe(settle.name, () => {
    describe("when have all players crack", () => {
        it("should not call calculate natural score", () => {
            // Arrange
            const p0: Hand<number[]> = {
                front: [0],
                middle: [0],
                back: [0],
            };
            isCrackMock.mockReturnValue(true);

            // Act
            settle([p0, p0, p0], initScoreConfig);

            // Assert
            expect(calculateNaturalScoreMock).toHaveBeenCalledTimes(0);
        });
    });
    describe("when have all player alert natural and they have natural", () => {
        it("should call call calculate natural and crack with all player", () => {
            // Arrange
            const p0: Hand<number[]> = {
                front: [0],
                middle: [0],
                back: [0],
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
                            ...initSettlement,
                            crack: {
                                isCrack: true,
                                units: -9,
                            },
                            natural: {
                                name: "",
                                units: -5,
                            },
                            sum: 0,
                        },
                    ],
                    [
                        1,
                        {
                            ...initSettlement,
                            crack: {
                                isCrack: false,
                                units: 3,
                            },
                            natural: {
                                name: "dragon",
                                units: 15,
                            },
                            sum: 0,
                        },
                    ],
                    [
                        2,
                        {
                            crack: {
                                isCrack: false,
                                units: 3,
                            },
                            natural: {
                                name: "",
                                units: -5,
                            },
                            normal: {
                                front: 1,
                                middle: 0,
                                back: -1,
                            },
                            pusoy: {
                                full: 0,
                                mini: {},
                            },
                            royalty: {
                                ...initSettlement.royalty,
                                middle: {
                                    name: "",
                                    units: -3,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        3,
                        {
                            ...initSettlement,
                            crack: {
                                isCrack: false,
                                units: 3,
                            },
                            natural: {
                                name: "",
                                units: -5,
                            },
                            normal: {
                                front: -1,
                                middle: 0,
                                back: 1,
                            },
                            royalty: {
                                ...initSettlement.royalty,
                                middle: {
                                    name: "royalFlush",
                                    units: 3,
                                },
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
                            ...initSettlement,
                            pusoy: {
                                full: 18,
                                mini: {},
                            },
                            royalty: {
                                front: {
                                    name: "threeOfAKind",
                                    units: 9,
                                },
                                middle: {
                                    name: "royalFlush",
                                    units: 15,
                                },
                                back: {
                                    name: "royalFlush",
                                    units: 12,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        1,
                        {
                            ...initSettlement,
                            normal: {
                                front: 2,
                                middle: 0,
                                back: 0,
                            },
                            pusoy: {
                                full: -3,
                                mini: {
                                    "2": 3,
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    name: "",
                                    units: -3,
                                },
                                middle: {
                                    name: "",
                                    units: -5,
                                },
                                back: {
                                    name: "",
                                    units: -4,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        2,
                        {
                            ...initSettlement,
                            normal: {
                                front: 0,
                                middle: -2,
                                back: -2,
                            },
                            pusoy: {
                                full: -9,
                                mini: {
                                    "1": -3,
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    name: "",
                                    units: -3,
                                },
                                middle: {
                                    name: "",
                                    units: -5,
                                },
                                back: {
                                    name: "",
                                    units: -4,
                                },
                            },
                            sum: 0,
                        },
                    ],
                    [
                        3,
                        {
                            ...initSettlement,
                            normal: {
                                front: -2,
                                middle: 2,
                                back: 2,
                            },
                            pusoy: {
                                full: -6,
                                mini: {
                                    "0": 0,
                                },
                            },
                            royalty: {
                                front: {
                                    name: "",
                                    units: -3,
                                },
                                middle: {
                                    name: "",
                                    units: -5,
                                },
                                back: {
                                    name: "",
                                    units: -4,
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
                const p0: Hand<number[]> = {
                    front: [0],
                    middle: [0],
                    back: [0],
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
