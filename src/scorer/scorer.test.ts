import { HandType } from "../const";
import { calculateSegmentScore } from "./scorer";
import "../helper/map-helpers";

describe("calculateSegmentScore", () => {
    test.each([
        [[1, 6, 20, 36, 43], HandType.HighCard],
        [[12, 21, 28, 29, 50], HandType.OnePair],
        [[9, 8, 34, 44, 46], HandType.TwoPairs],
        [[2, 14, 16, 17, 19], HandType.ThreeOfAKind],
        [[2, 4, 50, 14, 8], HandType.Straight],
        [[12, 40, 28, 4, 16], HandType.Flush],
        [[25, 26, 27, 20, 21], HandType.FullHouse],
        [[25, 26, 27, 24, 21], HandType.FourOfAKind],
        [[9, 13, 25, 21, 17], HandType.StraightFlush],
        [[34, 38, 42, 50, 46], HandType.RoyalFlush],
        [[0, 0, 0, 0, 0], HandType.Unknown],
        [[31, 22, 25], HandType.HighCard],
        [[29, 3, 0], HandType.OnePair],
        [[47, 46, 44], HandType.ThreeOfAKind],
    ])("calculateSegmentScore(%j) should return type %j", (cards, expected) => {
        const handType = calculateSegmentScore(cards).type;

        expect(handType).toBe(expected);
    });
});
