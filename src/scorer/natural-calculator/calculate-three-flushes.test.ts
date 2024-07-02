import { calculateThreeFlushes } from "./calculate-three-flushes";
import { calculateSegmentScore } from "../calculate-segment-score";
import { NaturalType } from "../../const";

describe(calculateThreeFlushes.name, () => {
    test.each([
        [
            {
                front: [8, 22, 39],
                middle: [9, 16, 17, 27, 42],
                back: [4, 19, 28, 37, 50],
            },
        ],
        [
            {
                front: [3, 30, 51],
                middle: [2, 12, 20, 25, 46],
                back: [32, 36, 40, 43, 49],
            },
        ],
    ])("%j should be undefined", (hand) => {
        const handScore = {
            front: calculateSegmentScore(hand.front),
            middle: calculateSegmentScore(hand.middle),
            back: calculateSegmentScore(hand.back),
        };

        const actual = calculateThreeFlushes(hand, handScore);

        expect(actual).toBe(undefined);
    });
    test.each([
        [
            {
                front: [7, 11, 23],
                middle: [43, 15, 3, 31, 35],
                back: [1, 13, 21, 29, 45],
            },
            {
                type: NaturalType.ThreeFlushes,
                rank: 330434,
                suit: 1,
            },
        ],
        [
            {
                front: [5, 9, 17],
                middle: [0, 12, 20, 32, 44],
                back: [26, 34, 42, 38, 50],
            },
            {
                type: NaturalType.ThreeFlushes,
                rank: 366333,
                suit: 2,
            },
        ],
    ])("%j should return %o", (hand, expected) => {
        const handScore = {
            front: calculateSegmentScore(hand.front),
            middle: calculateSegmentScore(hand.middle),
            back: calculateSegmentScore(hand.back),
        };

        const actual = calculateThreeFlushes(hand, handScore);

        expect(actual).toMatchObject(expected);
    });
});
