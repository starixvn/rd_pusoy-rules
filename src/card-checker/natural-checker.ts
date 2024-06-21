import { HandType, Natural } from "../consts";
import { isContinuous, isLowStraight } from "./hand-type-checker";
import { countSameRank, statisticCard } from "../helper/statistic-card";
import { Hand, SegmentScore } from "../types";

export const checkNatural = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
    naturalConfig: Record<string, number>
) => {
    const cards = hand.front.concat(hand.middle).concat(hand.back);
    const { rankMap, suitSet } = statisticCard(cards);
    const sameRankCounter = countSameRank(rankMap);
    const sortedRank = Array.from(rankMap.keys()).sort();
    const dragon = isDragon(sortedRank);

    if (
        naturalConfig.hasOwnProperty(Natural.Dragon) &&
        naturalConfig.hasOwnProperty(Natural.SuperDragon) &&
        dragon
    ) {
        return dragonBaseCheck(suitSet, naturalConfig);
    }

    if (
        naturalConfig.hasOwnProperty(Natural.SixPairs) &&
        sameRankCounter.get(2)?.length === 6
    ) {
        return {
            [Natural.SixPairs]: naturalConfig[Natural.SixPairs],
        };
    }

    if (
        naturalConfig.hasOwnProperty(Natural.ThreeStraights) &&
        handScore.back.typeScore === HandType.Straight &&
        handScore.middle.typeScore === HandType.Straight &&
        isContinuous(hand.front) &&
        isLowStraight(sortedRank)
    ) {
        return {
            [Natural.ThreeStraights]: naturalConfig[Natural.ThreeStraights],
        };
    }

    const { suitSet: frontSuitSet } = statisticCard(hand.front);
    if (
        naturalConfig.hasOwnProperty(Natural.ThreeFlushes) &&
        handScore.back.typeScore === HandType.Flush &&
        handScore.middle.typeScore === HandType.Flush &&
        frontSuitSet.size === 1
    ) {
        return {
            [Natural.ThreeFlushes]: naturalConfig[Natural.ThreeFlushes],
        };
    }

    return {};
};

const dragonBaseCheck = (
    suitSet: Set<number>,
    naturalConfig: Record<string, number>
) => {
    if (suitSet.size === 1) {
        return {
            [Natural.SuperDragon]: naturalConfig[Natural.SuperDragon],
        };
    }

    return {
        [Natural.Dragon]: naturalConfig[Natural.Dragon],
    };
};

const isDragon = (ranks: number[]) => {
    return isContinuous(ranks);
};
