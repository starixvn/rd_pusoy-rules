import { HandTypeRank } from "../const";
import { isCrack } from "./is-crack";

describe("Crack Checker", () => {
    test.each([
        [
            {
                front: {
                    type: HandTypeRank.TwoPairs,
                    suit: 0,
                    rank: 0,
                },
                middle: {
                    type: HandTypeRank.OnePair,
                    suit: 0,
                    rank: 0,
                },
                back: {
                    type: HandTypeRank.Flush,
                    suit: 0,
                    rank: 0,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandTypeRank.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandTypeRank.HighCard,
                    suit: 0,
                    rank: 2,
                },
                back: {
                    type: HandTypeRank.Flush,
                    suit: 0,
                    rank: 0,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandTypeRank.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandTypeRank.HighCard,
                    suit: 1,
                    rank: 3,
                },
                back: {
                    type: HandTypeRank.HighCard,
                    suit: 0,
                    rank: 3,
                },
            },
            true,
        ],
        [
            {
                front: {
                    type: HandTypeRank.HighCard,
                    suit: 0,
                    rank: 3,
                },
                middle: {
                    type: HandTypeRank.OnePair,
                    suit: 1,
                    rank: 3,
                },
                back: {
                    type: HandTypeRank.TwoPairs,
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
