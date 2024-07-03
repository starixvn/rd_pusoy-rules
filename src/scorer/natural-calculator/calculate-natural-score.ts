import { Natural, initNaturalScore } from "../../const";
import { countSameRank, statisticCard } from "../../helper/card-helpers";
import { getSortedIncreaseKeys } from "../../helper/map-helpers";
import { Hand, NaturalConfig, NaturalScore, SegmentScore } from "../../types";
import { calculateDragon } from "./calculate-dragon";
import { calculateSixPairs } from "./calculate-six-pairs";
import { calculateThreeFlushes } from "./calculate-three-flushes";
import { calculateThreeStraights } from "./calculate-three-straights";

export const calculateNaturalScore = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
    naturalConfig: NaturalConfig[],
): NaturalScore => {
    const cards = hand.front.concat(hand.middle).concat(hand.back);
    const { rankMap } = statisticCard(cards);
    const sameRankCounter = countSameRank(rankMap);
    const sortedRank = getSortedIncreaseKeys(rankMap);

    const naturalCheckerMap: Record<
        string,
        () => Partial<NaturalScore> | undefined
    > = {
        [Natural.Dragon]: () => calculateDragon(sortedRank, cards),

        [Natural.SixPairs]: () => calculateSixPairs(sameRankCounter, rankMap),

        [Natural.ThreeFlushes]: () => calculateThreeFlushes(hand, handScore),

        [Natural.ThreeStraights]: () =>
            calculateThreeStraights(hand, handScore),
    };

    for (let i = 0; i < naturalConfig.length; i++) {
        const { name, units } = naturalConfig[i];
        const scoreType = naturalConfig.length - i;
        const checker = naturalCheckerMap[name];
        if (checker) {
            const result = checker();
            if (result) {
                return {
                    ...initNaturalScore,
                    ...result,
                    name,
                    units,
                    type: scoreType,
                };
            }
        }
    }

    return initNaturalScore;
};
