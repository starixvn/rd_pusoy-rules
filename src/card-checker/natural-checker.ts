import { HandType, NaturalDisplay, NaturalType } from "../const";
import { isContinuous, isLowStraight } from "./hand-type-checker";
import { countSameRank, statisticCard } from "../helper/statistic-card";
import { Hand, NaturalScore, SegmentScore } from "../types";

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
    const sortedRank = Array.from(rankMap.keys()).sort();

    if (
        naturalConfig.hasOwnProperty(NaturalDisplay[NaturalType.Dragon]) &&
        isContinuous(sortedRank)
    ) {
        return {
            isNatural: true,
            naturalScore: {
                type: NaturalType.Dragon,
                rank: 0,
                suit: Math.max(...cards) % 4,
            },
        };
    }

    if (
        naturalConfig.hasOwnProperty(NaturalDisplay[NaturalType.SixPairs]) &&
        (sameRankCounter.get(2)?.length === 6 ||
            (sameRankCounter.get(3)?.length === 5 &&
                sameRankCounter.get(2)?.length === 1) ||
            (sameRankCounter.get(4)?.length ?? 0) * 4 +
                (sameRankCounter.get(2)?.length ?? 0) * 2 ===
                12)
    ) {
        const maxCard = Math.max(
            ...(sameRankCounter.get(2) ?? []),
            ...(sameRankCounter.get(3) ?? []),
            ...(sameRankCounter.get(4) ?? []),
        );
        const maxSuit = Math.max(...(rankMap.get(maxCard) ?? []));
        return {
            isNatural: true,
            naturalScore: {
                type: NaturalType.SixPairs,
                rank: maxCard,
                suit: maxSuit,
            },
        };
    }

    const { suitSet: frontSuitSet } = statisticCard(hand.front);
    if (
        naturalConfig.hasOwnProperty(
            NaturalDisplay[NaturalType.ThreeFlushes],
        ) &&
        handScore.back.type === HandType.Flush &&
        handScore.middle.type === HandType.Flush &&
        frontSuitSet.size === 1
    ) {
        return {
            isNatural: true,
            naturalScore: {
                type: NaturalType.ThreeFlushes,
                rank: 0,
                suit: Math.max(...hand.front) % 4,
            },
        };
    }

    if (
        naturalConfig.hasOwnProperty(
            NaturalDisplay[NaturalType.ThreeStraights],
        ) &&
        handScore.back.type === HandType.Straight &&
        handScore.middle.type === HandType.Straight &&
        isContinuous(hand.front) &&
        isLowStraight(sortedRank)
    ) {
        return {
            isNatural: true,
            naturalScore: {
                type: NaturalType.ThreeStraights,
                rank: 0,
                suit: Math.max(...hand.front) % 4,
            },
        };
    }

    return {
        isNatural: false,
        naturalScore: { type: NaturalType.Unknown, rank: 0, suit: 0 },
    };
};
