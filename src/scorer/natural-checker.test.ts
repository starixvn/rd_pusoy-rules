import { NaturalDisplay, NaturalType } from "../const";
import { isLarger } from "../helper/card-helpers";
import { ScoreConfig } from "../types";
import { checkNatural } from "./natural-checker";
import { calculateSegmentScore } from "./scorer";

const scoreConfig: ScoreConfig = {
    normal: 1,
    natural: {
        threeFlushes: 3,
        sixPairs: 6,
        dragon: 12,
        threeStraights: 3,
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

describe("NaturalChecker", () => {
    describe("Check cards are natural", () => {
        test.each([
            [
                [7, 48, 3],
                [39, 26, 29, 41, 33],
                [22, 19, 8, 15, 27],
                NaturalDisplay[NaturalType.ThreeStraights],
            ],
            [
                [20, 0, 4],
                [16, 30, 14, 36, 40],
                [51, 11, 32, 24, 45],
                NaturalDisplay[NaturalType.Dragon],
            ],
            [
                [12, 28, 44],
                [37, 13, 25, 49, 17],
                [34, 38, 42, 50, 46],
                NaturalDisplay[NaturalType.ThreeFlushes],
            ],
            [
                [2, 1, 21],
                [5, 6, 9, 10, 23],
                [42, 43, 18, 31, 28],
                NaturalDisplay[NaturalType.SixPairs],
            ],
            [
                [2, 1, 21],
                [5, 6, 34, 10, 23],
                [42, 43, 18, 31, 28],
                NaturalDisplay[NaturalType.Unknown],
            ],
        ])(
            "cards %j %j %j should be natural %j",
            (front, middle, back, naturalType) => {
                const hand = {
                    front,
                    middle,
                    back,
                };
                const handScore = {
                    front: calculateSegmentScore(hand.front),
                    middle: calculateSegmentScore(hand.middle),
                    back: calculateSegmentScore(hand.back),
                };

                const { naturalScore } = checkNatural(
                    hand,
                    handScore,
                    scoreConfig.natural,
                );

                expect(NaturalDisplay[naturalScore.type]).toBe(naturalType);
            },
        );
    });
    describe("Compare natural", () => {
        describe("different natural type", () => {
            test.each([
                [
                    {
                        front: [20, 0, 4],
                        middle: [16, 30, 14, 36, 40],
                        back: [51, 11, 32, 24, 45],
                    },
                    {
                        front: [12, 28, 44],
                        middle: [37, 13, 25, 49, 17],
                        back: [34, 38, 42, 50, 46],
                    },
                ],
            ])("cards %j should be greater than cards %j", (hand1, hand2) => {
                const handScore1 = {
                    front: calculateSegmentScore(hand1.front),
                    middle: calculateSegmentScore(hand1.middle),
                    back: calculateSegmentScore(hand1.back),
                };

                const handScore2 = {
                    front: calculateSegmentScore(hand2.front),
                    middle: calculateSegmentScore(hand2.middle),
                    back: calculateSegmentScore(hand2.back),
                };

                const { naturalScore: naturalScore1 } = checkNatural(
                    hand1,
                    handScore1,
                    scoreConfig.natural,
                );

                const { naturalScore: naturalScore2 } = checkNatural(
                    hand2,
                    handScore2,
                    scoreConfig.natural,
                );

                expect(isLarger(naturalScore1, naturalScore2)).toBe(true);
            });
        });

        describe("same natural type", () => {
            test.each([
                [
                    {
                        front: [34, 13, 37],
                        middle: [28, 17, 20, 24, 43],
                        back: [51, 2, 6, 11, 46],
                    },
                    {
                        front: [38, 40, 35],
                        middle: [44, 31, 25, 21, 16],
                        back: [49, 1, 10, 12, 4],
                    },
                ],
                [
                    {
                        front: [42, 46, 37],
                        middle: [18, 24, 20, 14, 28],
                        back: [44, 38, 35, 40, 51],
                    },
                    {
                        front: [4, 1, 48],
                        middle: [3, 7, 9, 17, 13],
                        back: [45, 41, 36, 49, 33],
                    },
                ],
                [
                    {
                        front: [0, 2, 25],
                        middle: [44, 43, 24, 31, 29],
                        back: [51, 50, 15, 13, 47],
                    },
                    {
                        front: [16, 18, 19],
                        middle: [21, 10, 8, 9, 11],
                        back: [17, 6, 7, 4, 5],
                    },
                ],
            ])("cards %j should be greater than cards %j", (hand1, hand2) => {
                const handScore1 = {
                    front: calculateSegmentScore(hand1.front),
                    middle: calculateSegmentScore(hand1.middle),
                    back: calculateSegmentScore(hand1.back),
                };

                const handScore2 = {
                    front: calculateSegmentScore(hand2.front),
                    middle: calculateSegmentScore(hand2.middle),
                    back: calculateSegmentScore(hand2.back),
                };

                const { naturalScore: naturalScore1 } = checkNatural(
                    hand1,
                    handScore1,
                    scoreConfig.natural,
                );

                const { naturalScore: naturalScore2 } = checkNatural(
                    hand2,
                    handScore2,
                    scoreConfig.natural,
                );

                expect(isLarger(naturalScore1, naturalScore2)).toBe(true);
            });
        });
    });
});
