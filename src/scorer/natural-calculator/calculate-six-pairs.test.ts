import { NaturalType } from "../../const";
import { countSameRank, statisticCard } from "../../helper/card-helpers";
import { calculateSixPairs } from "./calculate-six-pairs";

describe(calculateSixPairs.name, () => {
    test.each([
        [[44, 36, 41, 30, 33, 47, 39, 49, 24, 28, 32, 18, 21]],
        [[45, 33, 37, 17, 32, 44, 47, 51, 1, 10, 24, 23, 39]],
    ])("%j should be undefined", (cards) => {
        const { rankMap } = statisticCard(cards);
        const sameRankCounter = countSameRank(rankMap);

        const actual = calculateSixPairs(sameRankCounter, rankMap);

        expect(actual).toBe(undefined);
    });

    test.each([
        [
            [14, 31, 13, 26, 20, 21, 27, 29, 40, 42, 41, 16, 19],
            {
                type: NaturalType.SixPairs,
                rank: 10,
                suit: 2,
            },
        ],
        [
            [0, 5, 43, 4, 9, 30, 12, 15, 3, 8, 28, 48, 49],
            {
                type: NaturalType.SixPairs,
                rank: 12,
                suit: 1,
            },
        ],
    ])("%j should be %o", (cards, expected) => {
        const { rankMap } = statisticCard(cards);
        const sameRankCounter = countSameRank(rankMap);

        const actual = calculateSixPairs(sameRankCounter, rankMap);

        expect(actual).toMatchObject(expected);
    });
});
