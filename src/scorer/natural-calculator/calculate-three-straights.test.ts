import { calculateThreeStraights } from "./calculate-three-straights";
import { calculateSegmentScore } from "../calculate-segment-score";

describe(calculateThreeStraights.name, () => {
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
        // Arrange
        const handScore = {
            front: calculateSegmentScore(hand.front),
            middle: calculateSegmentScore(hand.middle),
            back: calculateSegmentScore(hand.back),
        };

        // Act
        const actual = calculateThreeStraights(hand, handScore);

        // Assert
        expect(actual).toBe(undefined);
    });
    test.each([
        [
            {
                front: [5, 9, 14],
                middle: [17, 12, 20, 25, 30],
                back: [26, 34, 42, 38, 29],
            },
            {
                rank: 10,
                suit: 2,
            },
        ],
        [
            {
                front: [4, 0, 48],
                middle: [2, 15, 10, 7, 50],
                back: [32, 36, 43, 51, 45],
            },
            {
                rank: 12,
                suit: 3,
            },
        ],
    ])("%j should return %o", (hand, expected) => {
        // Arrange
        const handScore = {
            front: calculateSegmentScore(hand.front),
            middle: calculateSegmentScore(hand.middle),
            back: calculateSegmentScore(hand.back),
        };

        // Act
        const actual = calculateThreeStraights(hand, handScore);

        // Assert
        expect(actual).toMatchObject(expected);
    });
});
