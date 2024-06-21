import { HandType, ROYAL_STRAIGHT } from "./consts";
import {
    isContinuous,
    isDistinct,
    isFourOfAKind,
    isFullHouse,
    isLowStraight,
    isOnePair,
    isThreeOfAKind,
    isTwoPair,
} from "./card-checker/hand-type-checker";
import { countSameRank, statisticCard } from "./helper/statistic-card";
import { SegmentScore } from "./types";

export const calculateSegmentScore = (cards: number[]): SegmentScore => {
    const { rankMap, suitSet } = statisticCard(cards);
    if (isDistinct(cards, rankMap)) {
        const rankSorted = Array.from(rankMap.keys()).sort();
        const lowStraightCards = isLowStraight(rankSorted);

        if (
            cards.length === 5 &&
            isContinuous(rankSorted) &&
            lowStraightCards
        ) {
            const maxRank = lowStraightCards
                ? rankSorted[rankSorted.length - 2]
                : rankSorted[rankSorted.length - 1];
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            let typeScore = HandType.Straight;
            if (rankSorted.join(",") === ROYAL_STRAIGHT && suitSet.size === 1) {
                typeScore = HandType.RoyalFlush;
            } else if (suitSet.size === 1) {
                typeScore = HandType.StraightFlush;
            }

            return {
                typeScore,
                rankScore: maxRank,
                suitScore: maxSuit,
            };
        } else {
            const maxRank = rankSorted[rankSorted.length - 1];
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            return {
                typeScore:
                    suitSet.size === 1 && cards.length === 5
                        ? HandType.Flush
                        : HandType.HighCard,
                rankScore: highCardBaseScore(rankSorted, 5, 13),
                suitScore: maxSuit,
            };
        }
    } else {
        const sameRankCounter = countSameRank(rankMap);
        const onePair = isOnePair(sameRankCounter);
        const twoPairs = isTwoPair(sameRankCounter);
        const threeOfAKind = isThreeOfAKind(sameRankCounter);
        const fullHouse = isFullHouse(sameRankCounter);

        if (onePair || twoPairs) {
            let single = sameRankCounter.get(1) || [];
            single = single.sort();
            let pairs = sameRankCounter.get(2) || [];
            let maxRank = getMax(pairs);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
            const handScore = highCardBaseScore([...pairs, ...single], 5, 13);

            return {
                typeScore: twoPairs ? HandType.TwoPairs : HandType.OnePair,
                rankScore: handScore,
                suitScore: maxSuit,
            };
        }
        if (threeOfAKind || fullHouse) {
            let trio = sameRankCounter.get(3) || [];
            const maxRank = getMax(trio);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            return {
                typeScore: fullHouse
                    ? HandType.FullHouse
                    : HandType.ThreeOfAKind,
                rankScore: maxRank,
                suitScore: maxSuit,
            };
        }
        if (isFourOfAKind(sameRankCounter)) {
            let quad = sameRankCounter.get(4) || [];
            const maxRank = getMax(quad);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
            return {
                typeScore: HandType.FourOfAKind,
                rankScore: maxRank,
                suitScore: maxSuit,
            };
        }
        return {
            typeScore: -1,
            rankScore: 0,
            suitScore: 0,
        };
    }
};

export const isLarger = (a: SegmentScore, b: SegmentScore): boolean => {
    if (a.typeScore > b.typeScore) {
        return true;
    }
    if (a.typeScore === b.typeScore && a.rankScore > b.rankScore) {
        return true;
    }
    if (a.typeScore === b.typeScore && a.rankScore === b.rankScore) {
        return a.suitScore > b.suitScore;
    }

    return false;
};

const highCardBaseScore = (ranks: number[], maxLevel: number, base: number) => {
    let result = 0;
    for (let i = 0; i < ranks.length; i++) {
        result +=
            ranks[ranks.length - i - 1] * Math.pow(base, maxLevel - i - 1);
    }
    return result;
};

const getMax = (array: number[]) => {
    array = array.sort();
    return array[array.length - 1];
};

const getMaxSuitByMaxRank = (
    rankMap: Map<number, number[]>,
    maxRank: number
) => {
    let suitsByMaxRank = rankMap.get(maxRank) || [0];
    const maxSuit = getMax(suitsByMaxRank);
    return maxSuit;
};
