import { countSameRank, statisticCard } from "../../helper/card-helpers";
import { calculateSixPairs } from "./calculate-six-pairs";

describe(calculateSixPairs.name, () => {
    test.each([
        [[44, 36, 41, 30, 33, 47, 39, 49, 24, 28, 32, 18, 21]],
        [[45, 33, 37, 17, 32, 44, 47, 51, 1, 10, 24, 23, 39]],
    ])("%j should be undefined", (cards) => {
        // Arrange
        const { rankMap } = statisticCard(cards);
        const sameRankCounter = countSameRank(rankMap);

        // Act
        const actual = calculateSixPairs(sameRankCounter, rankMap);

        // Assert
        expect(actual).toBe(undefined);
    });

    test.each([
        [
            [14, 31, 13, 26, 20, 21, 27, 29, 40, 42, 41, 16, 19],
            {
                rank: 10,
                suit: 2,
            },
        ],
        [
            [0, 5, 43, 4, 9, 30, 12, 15, 3, 8, 28, 48, 49],
            {
                rank: 12,
                suit: 1,
            },
        ],
        [
            [39, 36, 28, 18, 16, 19, 17, 37, 31, 32, 33, 35, 34],
            {
                rank: 9,
                suit: 3,
            },
        ],
        [
            [3, 13, 15, 1, 11, 10, 21, 43, 24, 23, 40, 47, 44],
            {
                rank: 11,
                suit: 3,
            },
        ],
        [
            [45, 11, 10, 2, 3, 0, 1, 9, 8, 5, 6, 7, 4],
            {
                rank: 2,
                suit: 3,
            },
        ],
    ])("%j should be %o", (cards, expected) => {
        // Arrange
        const { rankMap } = statisticCard(cards);
        const sameRankCounter = countSameRank(rankMap);

        // Act
        const actual = calculateSixPairs(sameRankCounter, rankMap);

        // Assert
        expect(actual).toMatchObject(expected);
    });
});
