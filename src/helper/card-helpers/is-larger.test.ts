import { HandType } from "../../const";
import { isLarger } from "./is-larger";

describe(isLarger.name, () => {
    test.each([
        [
            {
                type: HandType.OnePair,
                rank: 2,
                suit: 0,
            },
            {
                type: HandType.HighCard,
                rank: 2,
                suit: 0,
            },
        ],
        [
            {
                type: HandType.OnePair,
                rank: 2,
                suit: 0,
            },
            {
                type: HandType.OnePair,
                rank: 1,
                suit: 0,
            },
        ],
        [
            {
                type: HandType.OnePair,
                rank: 2,
                suit: 1,
            },
            {
                type: HandType.OnePair,
                rank: 2,
                suit: 0,
            },
        ],
    ])("Score %o should be greater than score %o", (score1, score2) => {
        const actual = isLarger(score1, score2);

        expect(actual).toBe(true);
    });
});
