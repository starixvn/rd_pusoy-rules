import { HandType, NaturalDisplay, NaturalType } from "../const";
import { isContinuous, isLowStraight } from "./hand-type-checker";
import { countSameRank, statisticCard } from "../helper/card-helpers";
import { Hand, NaturalScore, SegmentScore } from "../types";
import { sortIncrease } from "../helper/array-helpers";
import { getSortedIncreaseKeys } from "../helper/map-helpers";

export const checkNatural = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
    naturalConfig: Record<string, number>,
): {
    isNatural: boolean;
    naturalScore: NaturalScore;
} => {
    const cards = hand.front.concat(hand.middle).concat(hand.back);
    const { rankMap } = statisticCard(cards);
    const sameRankCounter = countSameRank(rankMap);
    const sortedRank = getSortedIncreaseKeys(rankMap);

    const orderOfNaturalCheck = Array.from(Object.keys(naturalConfig)).sort(
        (a, b) => naturalConfig[b] - naturalConfig[a],
    );

    const naturalCheckerMap = {
        [NaturalDisplay[NaturalType.Dragon]]: () => {
            if (isContinuous(sortedRank)) {
                return {
                    isNatural: true,
                    naturalScore: {
                        type: NaturalType.Dragon,
                        rank: 0,
                        suit: Math.max(...cards),
                    },
                };
            }

            return undefined;
        },

        [NaturalDisplay[NaturalType.SixPairs]]: () => {
            if (
                sameRankCounter.get(2)?.length === 6 ||
                (sameRankCounter.get(3)?.length === 5 &&
                    sameRankCounter.get(2)?.length === 1) ||
                (sameRankCounter.get(4)?.length ?? 0) * 4 +
                    (sameRankCounter.get(2)?.length ?? 0) * 2 ===
                    12
            ) {
                const maxCard = Math.max(
                    ...(sameRankCounter.get(2) ?? []),
                    ...(sameRankCounter.get(3) ?? []),
                    ...(sameRankCounter.get(4) ?? []),
                );
                const maxSuit = Math.max(...rankMap.get(maxCard)!);
                return {
                    isNatural: true,
                    naturalScore: {
                        type: NaturalType.SixPairs,
                        rank: maxCard,
                        suit: maxSuit,
                    },
                };
            }

            return undefined;
        },

        [NaturalDisplay[NaturalType.ThreeFlushes]]: () => {
            const { suitSet: frontSuitSet } = statisticCard(hand.front);
            if (
                (handScore.back.type === HandType.Flush ||
                    handScore.back.type === HandType.StraightFlush ||
                    handScore.back.type === HandType.RoyalFlush) &&
                (handScore.middle.type === HandType.Flush ||
                    handScore.middle.type === HandType.StraightFlush ||
                    handScore.middle.type === HandType.RoyalFlush) &&
                frontSuitSet.size === 1
            ) {
                return {
                    isNatural: true,
                    naturalScore: {
                        type: NaturalType.ThreeFlushes,
                        rank: handScore.back.rank,
                        suit: Math.max(...hand.back) % 4,
                    },
                };
            }

            return undefined;
        },

        [NaturalDisplay[NaturalType.ThreeStraights]]: () => {
            const sortedRankAtFront = sortIncrease(
                hand.front.map((c) => Math.floor(c / 4)),
            );
            if (
                handScore.back.type === HandType.Straight &&
                handScore.middle.type === HandType.Straight &&
                (isContinuous(sortedRankAtFront) ||
                    isLowStraight(sortedRankAtFront))
            ) {
                return {
                    isNatural: true,
                    naturalScore: {
                        type: NaturalType.ThreeStraights,
                        rank: handScore.back.rank,
                        suit: Math.max(...hand.back) % 4,
                    },
                };
            }

            return undefined;
        },
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

    return {
        isNatural: false,
        naturalScore: { type: NaturalType.Unknown, rank: 0, suit: 0 },
    };
};
