import { HandType, ROYAL_STRAIGHT } from "./const";
import {
    isContinuous,
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
    if (cards.length === rankMap.size) {
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
                type: typeScore,
                rank: maxRank,
                suit: maxSuit,
            };
        } else {
            const maxRank = rankSorted[rankSorted.length - 1];
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            return {
                type:
                    suitSet.size === 1 && cards.length === 5
                        ? HandType.Flush
                        : HandType.HighCard,
                rank: highCardBaseScore(rankSorted, 5, 13),
                suit: maxSuit,
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
            let maxRank = Math.max(...pairs);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
            const handScore = highCardBaseScore([...pairs, ...single], 5, 13);

            return {
                type: twoPairs ? HandType.TwoPairs : HandType.OnePair,
                rank: handScore,
                suit: maxSuit,
            };
        }
        if (threeOfAKind || fullHouse) {
            let trio = sameRankCounter.get(3) || [];
            const maxRank = Math.max(...trio);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            return {
                type: fullHouse ? HandType.FullHouse : HandType.ThreeOfAKind,
                rank: maxRank,
                suit: maxSuit,
            };
        }
        if (isFourOfAKind(sameRankCounter)) {
            let quad = sameRankCounter.get(4) || [];
            const maxRank = Math.max(...quad);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
            return {
                type: HandType.FourOfAKind,
                rank: maxRank,
                suit: maxSuit,
            };
        }
        return {
            type: HandType.Unknown,
            rank: 0,
            suit: 0,
        };
    }
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
    let suitsByMaxRank = rankMap.get(maxRank) || [0];
    const maxSuit = Math.max(...suitsByMaxRank);
    return maxSuit;
};
