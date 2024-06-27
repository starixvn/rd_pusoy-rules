import { HandType, NaturalType } from "./const";
import { initSettlement } from "./helper/initializer";
import "./helper/map-helpers";
import { checkNatural } from "./scorer";
import {
    calculateFullPusoy,
    calculateNaturalAndCrack,
    classifyPlayers,
    compareHands,
} from "./settler";
import {
    Hand,
    NaturalScore,
    ScoreConfig,
    SegmentScore,
    Settlement,
} from "./types";

const checkNaturalMock = checkNatural as jest.Mock;
jest.mock("./scorer");

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

describe("settler", () => {
    describe("classifyPlayers", () => {
        describe("all players not alert natural", () => {
            it("should not call check natural", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };
                const p2 = {
                    front: [2],
                    middle: [2],
                    back: [2],
                };

                classifyPlayers(
                    [p0, p1, p2],
                    [false, false, false],
                    scoreConfig,
                );

                expect(checkNaturalMock).toHaveBeenCalledTimes(0);
            });
        });
        describe("players alert natural", () => {
            it("should call check natural with player alerted", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };
                const p2 = {
                    front: [2],
                    middle: [2],
                    back: [2],
                };

                checkNaturalMock.mockReturnValue({
                    isNatural: false,
                    naturalScore: {
                        type: 0,
                        rank: 0,
                        suit: 0,
                    },
                });

                classifyPlayers([p0, p1, p2], [true, true, false], scoreConfig);

                expect(checkNaturalMock).toHaveBeenCalledTimes(2);
            });
        });
        describe("player has natural", () => {
            it("naturalPlayers should have size 1", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };
                const p2 = {
                    front: [2],
                    middle: [2],
                    back: [2],
                };

                checkNaturalMock.mockReturnValue({
                    isNatural: true,
                    naturalScore: {
                        type: NaturalType.ThreeFlushes,
                        rank: 0,
                        suit: 0,
                    },
                });

                const { naturalPlayers } = classifyPlayers(
                    [p0, p1, p2],
                    [true, false, false],
                    scoreConfig,
                );

                expect(naturalPlayers.size).toBe(1);
            });
        });
    });
    describe("calculateNaturalAndCrack", () => {
        describe("player 0 is crack, player 1 is natural", () => {
            it("should return player 0 is crack and player 1 is natural", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };
                const naturalPlayers: Map<number, NaturalScore> = new Map();
                naturalPlayers.set(1, {
                    type: NaturalType.ThreeFlushes,
                    rank: 0,
                    suit: 0,
                });
                const crackPlayers: Set<number> = new Set();
                crackPlayers.add(0);

                const result = calculateNaturalAndCrack(
                    [p0, p1],
                    new Map(),
                    scoreConfig,
                    naturalPlayers,
                    crackPlayers,
                );

                const isCracks = Array.from(result.keys())
                    .sort()
                    .map((k) => result.get(k)!.crack.isCrack);
                const isNaturals = Array.from(result.keys())
                    .sort()
                    .map((k) => result.get(k)!.natural);
                expect(isCracks).toStrictEqual([true, false]);
                expect(isNaturals).toStrictEqual([
                    { threeFlushes: -3 },
                    { threeFlushes: 3 },
                ]);
            });
        });
        describe("player 0 is crack, player 1 is crack", () => {
            it("should return player 0 and player 1 is crack", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };
                const naturalPlayers: Map<number, NaturalScore> = new Map();
                const crackPlayers: Set<number> = new Set();
                crackPlayers.add(0);
                crackPlayers.add(1);

                const result = calculateNaturalAndCrack(
                    [p0, p1],
                    new Map(),
                    scoreConfig,
                    naturalPlayers,
                    crackPlayers,
                );

                const isCracks = Array.from(result.keys())
                    .sort()
                    .map((k) => result.get(k)!.crack.isCrack);
                expect(isCracks).toStrictEqual([true, true]);
            });
        });
        describe("player 0 is natural three flushes, player 1 is dragon", () => {
            it("should return player 0 has subtract dragon score, player 1 has dragon score", () => {
                const p0 = {
                    front: [0],
                    middle: [0],
                    back: [0],
                };
                const p1 = {
                    front: [1],
                    middle: [1],
                    back: [1],
                };

                const naturalPlayers: Map<number, NaturalScore> = new Map();
                naturalPlayers.set(0, {
                    type: NaturalType.ThreeFlushes,
                    rank: 0,
                    suit: 0,
                });
                naturalPlayers.set(1, {
                    type: NaturalType.Dragon,
                    rank: 0,
                    suit: 0,
                });
                const crackPlayers: Set<number> = new Set();

                const result = calculateNaturalAndCrack(
                    [p0, p1],
                    new Map(),
                    scoreConfig,
                    naturalPlayers,
                    crackPlayers,
                );

                const isNaturals = Array.from(result.keys())
                    .sort()
                    .map((k) => result.get(k)!.natural);
                expect(isNaturals).toStrictEqual([
                    { dragon: -12 },
                    { dragon: 12 },
                ]);
            });
        });
    });
    describe("compareHands", () => {
        describe("player 0 > player 1 at front and middle, player 0 < player 1 at back", () => {
            it("should return sum score segment player 0 > sum score segment player 1", () => {
                const compareHandPlayers: Map<
                    number,
                    Hand<SegmentScore>
                > = new Map();
                compareHandPlayers.set(0, {
                    front: { type: HandType.OnePair, suit: 1, rank: 0 },
                    middle: { type: HandType.ThreeOfAKind, suit: 2, rank: 0 },
                    back: { type: HandType.Straight, suit: 3, rank: 0 },
                });
                compareHandPlayers.set(1, {
                    front: { type: HandType.OnePair, suit: 0, rank: 0 },
                    middle: { type: HandType.TwoPairs, suit: 2, rank: 0 },
                    back: { type: HandType.Straight, suit: 0, rank: 5 },
                });

                const { result } = compareHands(
                    compareHandPlayers,
                    scoreConfig,
                    new Map(),
                );

                const sums = Array.from(result.keys())
                    .sort()
                    .map((k) =>
                        Object.values(result.get(k)!.normal).reduce(
                            (a, b) => a + b,
                            0,
                        ),
                    );
                expect(sums[0] > sums[1]).toBe(true);
            });
        });
        describe("player 0 > player 1 at front, middle and back", () => {
            it("player 0 should pusoy", () => {
                const compareHandPlayers: Map<
                    number,
                    Hand<SegmentScore>
                > = new Map();
                compareHandPlayers.set(0, {
                    front: { type: HandType.OnePair, suit: 1, rank: 1 },
                    middle: { type: HandType.ThreeOfAKind, suit: 2, rank: 0 },
                    back: { type: HandType.Flush, suit: 3, rank: 0 },
                });
                compareHandPlayers.set(1, {
                    front: { type: HandType.OnePair, suit: 0, rank: 0 },
                    middle: { type: HandType.TwoPairs, suit: 2, rank: 0 },
                    back: { type: HandType.Straight, suit: 0, rank: 5 },
                });

                const { pusoyPlayers } = compareHands(
                    compareHandPlayers,
                    scoreConfig,
                    new Map(),
                );

                expect(pusoyPlayers.get(0) !== undefined).toBe(true);
            });
        });
        describe("player 0 > player 1 at front with three of a kind (royalty)", () => {
            it("should return player 0 has royalty score and player 1 has subtract royalty score", () => {
                const compareHandPlayers: Map<
                    number,
                    Hand<SegmentScore>
                > = new Map();
                compareHandPlayers.set(0, {
                    front: { type: HandType.ThreeOfAKind, suit: 1, rank: 1 },
                    middle: { type: HandType.ThreeOfAKind, suit: 2, rank: 0 },
                    back: { type: HandType.Straight, suit: 3, rank: 0 },
                });
                compareHandPlayers.set(1, {
                    front: { type: HandType.OnePair, suit: 0, rank: 0 },
                    middle: { type: HandType.TwoPairs, suit: 2, rank: 0 },
                    back: { type: HandType.Straight, suit: 0, rank: 5 },
                });

                const { result } = compareHands(
                    compareHandPlayers,
                    scoreConfig,
                    new Map(),
                );

                const royalties = Array.from(result.keys())
                    .sort()
                    .map((k) => result.get(k)!.royalty);
                expect(royalties).toStrictEqual([
                    {
                        front: { threeOfAKind: 3 },
                        middle: {},
                        back: {},
                    },
                    {
                        front: { threeOfAKind: -3 },
                        middle: {},
                        back: {},
                    },
                ]);
            });
        });
    });
    describe("calculateFullPusoy", () => {
        describe("player 0 full pusoy player 1 and player 2", () => {
            it("should return player 0 has full pusoy score and others should subtract full pusoy score", () => {
                const pusoyPlayers: Map<number, number[]> = new Map();
                pusoyPlayers.set(0, [1, 2]);
                const tempResult: Map<number, Settlement> = new Map();
                tempResult.set(0, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            1: 3,
                            2: 3,
                        },
                        full: 0,
                    },
                });
                tempResult.set(1, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            0: -3,
                        },
                        full: 0,
                    },
                });
                tempResult.set(2, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            0: -3,
                        },
                        full: 0,
                    },
                });

                const result = calculateFullPusoy(
                    pusoyPlayers,
                    3,
                    tempResult,
                    scoreConfig,
                );

                const fullPusoy = Array.from(result.keys())
                    .sort()
                    .map((k) => {
                        return result.get(k)!.pusoy.full;
                    });
                expect(fullPusoy).toStrictEqual([12, -6, -6]);
            });
        });
        describe("player 0 full pusoy, player 1 partial pusoy player 2", () => {
            it("should return player 0 full pusoy score and player 1 increase full pusoy score and player 2 decrease full pusoy score", () => {
                const pusoyPlayers: Map<number, number[]> = new Map();
                pusoyPlayers.set(0, [1, 2]);
                const tempResult: Map<number, Settlement> = new Map();
                tempResult.set(0, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            1: 3,
                            2: 3,
                        },
                        full: 0,
                    },
                });
                tempResult.set(1, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            0: -3,
                            1: 3,
                        },
                        full: 0,
                    },
                });
                tempResult.set(2, {
                    ...initSettlement,
                    pusoy: {
                        partial: {
                            0: -3,
                            1: -3,
                        },
                        full: 0,
                    },
                });

                const result = calculateFullPusoy(
                    pusoyPlayers,
                    3,
                    tempResult,
                    scoreConfig,
                );

                const fullPusoy = Array.from(result.keys())
                    .sort()
                    .map((k) => {
                        return result.get(k)!.pusoy.full;
                    });
                expect(fullPusoy).toStrictEqual([12, -3, -9]);
            });
        });
    });
});
