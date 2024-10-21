import { HandTypeRank, ROYAL_STRAIGHT } from "../const";
import {
    isStraight,
    isFourOfAKind,
    isFullHouse,
    isLowStraight,
    isOnePair,
    isThreeOfAKind,
    isTwoPairs,
} from "./hands";
import { countSameRank, statisticCard } from "../helper/card-helpers";
import { SegmentScore } from "../types";
import { sortIncrease } from "../helper/array-helpers";
import { getSortedIncreaseKeys } from "../helper/map-helpers";

export const calculateSegmentScore = (cards: number[]): SegmentScore => {
    const { rankMap, suitSet } = statisticCard(cards);

    if (cards.length === rankMap.size) {
        return handleUniqueRanks(cards, rankMap, suitSet);
    } else {
        return handleDuplicateRanks(rankMap);
    }
};

const handleUniqueRanks = (
    cards: number[],
    rankMap: Map<number, number[]>,
    suitSet: Set<number>,
): SegmentScore => {
    const rankSorted = getSortedIncreaseKeys(rankMap);

    if (cards.length === 5 && isStraight(rankSorted, true)) {
        return handleStraight(rankSorted, rankMap, suitSet);
    } else {
        return handleHighCardOrFlush(
            rankSorted,
            rankMap,
            suitSet,
            cards.length,
        );
    }
};

const handleStraight = (
    rankSorted: number[],
    rankMap: Map<number, number[]>,
    suitSet: Set<number>,
): SegmentScore => {
    const maxRank = isLowStraight(rankSorted)
        ? rankSorted[rankSorted.length - 2]
        : rankSorted[rankSorted.length - 1];
    const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

    let typeScore = HandTypeRank.Straight;
    if (rankSorted.join(",") === ROYAL_STRAIGHT && suitSet.size === 1) {
        typeScore = HandTypeRank.RoyalFlush;
    } else if (suitSet.size === 1) {
        typeScore = HandTypeRank.StraightFlush;
    }

    return {
        type: typeScore,
        rank: maxRank,
        suit: maxSuit,
    };
};

const handleHighCardOrFlush = (
    rankSorted: number[],
    rankMap: Map<number, number[]>,
    suitSet: Set<number>,
    cardCount: number,
): SegmentScore => {
    const maxRank = rankSorted[rankSorted.length - 1];
    const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

    return {
        type:
            suitSet.size === 1 && cardCount === 5
                ? HandTypeRank.Flush
                : HandTypeRank.HighCard,
        rank: highCardBaseScore(rankSorted, 5, 13),
        suit: maxSuit,
    };
};

const handleDuplicateRanks = (rankMap: Map<number, number[]>): SegmentScore => {
    const sameRankCounter = countSameRank(rankMap);

    if (isOnePair(sameRankCounter) || isTwoPairs(sameRankCounter)) {
        return handlePairs(sameRankCounter, rankMap);
    }
    if (isThreeOfAKind(sameRankCounter) || isFullHouse(sameRankCounter)) {
        return handleThreeOfAKindOrFullHouse(sameRankCounter, rankMap);
    }
    if (isFourOfAKind(sameRankCounter)) {
        return handleFourOfAKind(sameRankCounter, rankMap);
    }

    return {
        type: HandTypeRank.Unknown,
        rank: 0,
        suit: 0,
    };
};

const handlePairs = (
    sameRankCounter: Map<number, number[]>,
    rankMap: Map<number, number[]>,
): SegmentScore => {
    let single = sameRankCounter.get(1) || [];
    single = sortIncrease(single);
    let pairs = sameRankCounter.get(2) || [];
    const maxRank = Math.max(...pairs);
    pairs = sortIncrease(pairs);
    const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
    const handScore = highCardBaseScore([...single, ...pairs], 5, 13);

    return {
        type: isTwoPairs(sameRankCounter)
            ? HandTypeRank.TwoPairs
            : HandTypeRank.OnePair,
        rank: handScore,
        suit: maxSuit,
    };
};

const handleThreeOfAKindOrFullHouse = (
    sameRankCounter: Map<number, number[]>,
    rankMap: Map<number, number[]>,
): SegmentScore => {
    const trio = sameRankCounter.get(3) || [];
    const maxRank = Math.max(...trio);
    const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

    return {
        type: isFullHouse(sameRankCounter)
            ? HandTypeRank.FullHouse
            : HandTypeRank.ThreeOfAKind,
        rank: maxRank,
        suit: maxSuit,
    };
};

const handleFourOfAKind = (
    sameRankCounter: Map<number, number[]>,
    rankMap: Map<number, number[]>,
): SegmentScore => {
    const quad = sameRankCounter.get(4) || [];
    const maxRank = Math.max(...quad);
    const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

    return {
        type: HandTypeRank.FourOfAKind,
        rank: maxRank,
        suit: maxSuit,
    };
};

const highCardBaseScore = (ranks: number[], maxLevel: number, base: number) => {
    let result = 0;
    for (let i = 0; i < ranks.length; i++) {
        result +=
            ranks[ranks.length - i - 1] * Math.pow(base, maxLevel - i - 1);
    }
    return result;
};

const getMaxSuitByMaxRank = (
    rankMap: Map<number, number[]>,
    maxRank: number,
) => {
    const suitsByMaxRank = rankMap.get(maxRank) || [];
    return Math.max(...suitsByMaxRank);
};
