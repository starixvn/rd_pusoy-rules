import { HandType } from "../const";

describe("calculateSegmentScore", () => {
    test.each([
        [[1, 2, 3], HandType.HighCard],
        [[1, 2, 3, 4, 5], HandType.RoyalFlush],
    ])("calculateSegmentScore(%j) should return %j", (cards, expected) => {});
});
