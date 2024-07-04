import { HandTypeMap, HandTypeRank } from "../const";
import { calculateSegmentScore } from "./calculate-segment-score";

describe("Scorer", () => {
    test.each([
        [[1, 6, 20, 36, 43], HandTypeMap[HandTypeRank.HighCard]],
        [[12, 21, 28, 29, 50], HandTypeMap[HandTypeRank.OnePair]],
        [[9, 8, 34, 44, 46], HandTypeMap[HandTypeRank.TwoPairs]],
        [[2, 14, 16, 17, 19], HandTypeMap[HandTypeRank.ThreeOfAKind]],
        [[2, 4, 50, 14, 8], HandTypeMap[HandTypeRank.Straight]],
        [[12, 40, 28, 4, 16], HandTypeMap[HandTypeRank.Flush]],
        [[25, 26, 27, 20, 21], HandTypeMap[HandTypeRank.FullHouse]],
        [[25, 26, 27, 24, 21], HandTypeMap[HandTypeRank.FourOfAKind]],
        [[9, 13, 25, 21, 17], HandTypeMap[HandTypeRank.StraightFlush]],
        [[34, 38, 42, 50, 46], HandTypeMap[HandTypeRank.RoyalFlush]],
        [[0, 0, 0, 0, 0], HandTypeMap[HandTypeRank.Unknown]],
        [[31, 22, 25], HandTypeMap[HandTypeRank.HighCard]],
        [[29, 3, 0], HandTypeMap[HandTypeRank.OnePair]],
        [[47, 46, 44], HandTypeMap[HandTypeRank.ThreeOfAKind]],
    ])("Cards %j should return type %j", (cards, expected) => {
        const handType = calculateSegmentScore(cards).type;

        expect(HandTypeMap[handType]).toBe(expected);
    });
});
