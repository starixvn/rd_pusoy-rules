import { NaturalType } from "../../const";
import { statisticCard } from "../../helper/card-helpers";
import { getSortedIncreaseKeys } from "../../helper/map-helpers";
import { calculateDragon } from "./calculate-dragon";

describe(calculateDragon.name, () => {
    test.each([
        [[44, 36, 41, 30, 33, 47, 39, 49, 24, 28, 32, 18, 21]],
        [[45, 33, 37, 17, 32, 44, 47, 51, 1, 10, 24, 23, 39]],
    ])("%d should be undefined", (cards) => {
        const { rankMap } = statisticCard(cards);
        const sortedRank = getSortedIncreaseKeys(rankMap);

        const actual = calculateDragon(sortedRank, cards);

        expect(actual).toBe(undefined);
    });

    test.each([
        [
            [30, 36, 48, 2, 11, 12, 18, 22, 6, 35, 25, 46, 41],
            {
                type: NaturalType.Dragon,
                rank: 48,
                suit: 0,
            },
        ],
        [
            [30, 36, 51, 2, 11, 12, 18, 22, 6, 35, 25, 46, 41],
            {
                type: NaturalType.Dragon,
                rank: 51,
                suit: 0,
            },
        ],
    ])("%d should be %o", (cards, expected) => {
        const { rankMap } = statisticCard(cards);
        const sortedRank = getSortedIncreaseKeys(rankMap);

        const actual = calculateDragon(sortedRank, cards);

        expect(actual).toMatchObject(expected);
    });
});
