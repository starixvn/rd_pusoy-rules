import { NaturalType } from "../../const";
import { statisticCard } from "../../helper/card-helpers";
import { getSortedIncreaseKeys } from "../../helper/map-helpers";
import { calculateDragon } from "./calculate-dragon";

describe(calculateDragon.name, () => {
    test.each([[[44, 36, 41, 30, 33, 47, 39, 49, 24, 28, 32, 18, 21]]])(
        "%d should be undefined",
        (cards) => {
            const { rankMap } = statisticCard(cards);
            const sortedRank = getSortedIncreaseKeys(rankMap);

            const actual = calculateDragon(sortedRank, cards);

            expect(actual).toBe(undefined);
        },
    );
});
