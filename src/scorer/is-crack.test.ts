import { HandType } from "../const";
import { isCrack } from "./is-crack";

describe("Crack Checker", () => {
    test.each([
        [
            {
                front: {
                    type: HandType.TwoPairs,
                    suit: 0,
                    rank: 0,
                },
                middle: {
                    type: HandType.OnePair,
                    suit: 0,
                    rank: 0,
                },
                back: {
                    type: HandType.Flush,
                    suit: 0,
                    rank: 0,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandType.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandType.HighCard,
                    suit: 0,
                    rank: 2,
                },
                back: {
                    type: HandType.Flush,
                    suit: 0,
                    rank: 0,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandType.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandType.HighCard,
                    suit: 1,
                    rank: 3,
                },
                back: {
                    type: HandType.HighCard,
                    suit: 0,
                    rank: 3,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandType.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandType.OnePair,
                    suit: 1,
                    rank: 3,
                },
                back: {
                    type: HandType.TwoPairs,
                    suit: 0,
                    rank: 3,
                },
            },
            false,
        ],
    ])('"Hand Score %j is crack" should be %j ', (handScore, expected) => {
        const actual = isCrack(handScore);

        expect(actual).toBe(expected);
    });
});
