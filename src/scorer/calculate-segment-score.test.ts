import { HandType, HandTypeDisplay } from "../const";
import { calculateSegmentScore } from "./calculate-segment-score";

describe("Scorer", () => {
    test.each([
        [[1, 6, 20, 36, 43], HandTypeDisplay[HandType.HighCard]],
        [[12, 21, 28, 29, 50], HandTypeDisplay[HandType.OnePair]],
        [[9, 8, 34, 44, 46], HandTypeDisplay[HandType.TwoPairs]],
        [[2, 14, 16, 17, 19], HandTypeDisplay[HandType.ThreeOfAKind]],
        [[2, 4, 50, 14, 8], HandTypeDisplay[HandType.Straight]],
        [[12, 40, 28, 4, 16], HandTypeDisplay[HandType.Flush]],
        [[25, 26, 27, 20, 21], HandTypeDisplay[HandType.FullHouse]],
        [[25, 26, 27, 24, 21], HandTypeDisplay[HandType.FourOfAKind]],
        [[9, 13, 25, 21, 17], HandTypeDisplay[HandType.StraightFlush]],
        [[34, 38, 42, 50, 46], HandTypeDisplay[HandType.RoyalFlush]],
        [[0, 0, 0, 0, 0], HandTypeDisplay[HandType.Unknown]],
        [[31, 22, 25], HandTypeDisplay[HandType.HighCard]],
        [[29, 3, 0], HandTypeDisplay[HandType.OnePair]],
        [[47, 46, 44], HandTypeDisplay[HandType.ThreeOfAKind]],
    ])("Cards %j should return type %j", (cards, expected) => {
        const handType = calculateSegmentScore(cards).type;

        expect(HandTypeDisplay[handType]).toBe(expected);
    });
});
