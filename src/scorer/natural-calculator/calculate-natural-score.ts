import { NaturalDisplay, NaturalType } from "../../const";
import { countSameRank, statisticCard } from "../../helper/card-helpers";
import { getSortedIncreaseKeys } from "../../helper/map-helpers";
import { Hand, NaturalScore, SegmentScore } from "../../types";
import { calculateDragon } from "./calculate-dragon";
import { calculateSixPairs } from "./calculate-six-pairs";
import { calculateThreeFlushes } from "./calculate-three-flushes";
import { calculateThreeStraights } from "./calculate-three-straights";

export const calculateNaturalScore = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
    naturalConfig: Record<string, number>,
): NaturalScore => {
    const cards = hand.front.concat(hand.middle).concat(hand.back);
    const { rankMap } = statisticCard(cards);
    const sameRankCounter = countSameRank(rankMap);
    const sortedRank = getSortedIncreaseKeys(rankMap);

    const orderOfNaturalCheck = Array.from(Object.keys(naturalConfig)).sort(
        (a, b) => naturalConfig[b] - naturalConfig[a],
    );

    const naturalCheckerMap = {
        [NaturalDisplay[NaturalType.Dragon]]: () =>
            calculateDragon(sortedRank, cards),

        [NaturalDisplay[NaturalType.SixPairs]]: () =>
            calculateSixPairs(sameRankCounter, rankMap),

        [NaturalDisplay[NaturalType.ThreeFlushes]]: () =>
            calculateThreeFlushes(hand, handScore),

        [NaturalDisplay[NaturalType.ThreeStraights]]: () =>
            calculateThreeStraights(hand, handScore),
    };

    for (const key of orderOfNaturalCheck) {
        const checker = naturalCheckerMap[key];
        if (checker) {
            const result = checker();
            if (result) {
                return result;
            }
        }
    }

    return { type: NaturalType.Unknown, rank: 0, suit: 0 };
};
