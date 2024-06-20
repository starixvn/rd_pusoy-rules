import { HAND_TYPE, ROYAL_STRAIGHT } from "./consts";
import {
    isContinuous,
    isDistinct,
    isFourOfAKind,
    isFullHouse,
    isLowStraight,
    isOnePair,
    isThreeOfAKind,
    isTwoPair,
} from "./hand-type-checker";
import { countSameRank, statisticCard } from "./statistic-card";
import { HandScore } from "./types";

export const calculateHandScore = (cards: number[]): HandScore => {
    const { rankMap, suitSet } = statisticCard(cards);
    if (isDistinct(cards, rankMap)) {
        const rankSorted = Array.from(rankMap.keys()).sort();
        const lowStraightCards = isLowStraight(cards);

        if (cards.length === 5 && isContinuous(cards) && lowStraightCards) {
            const maxRank = lowStraightCards
                ? rankSorted[rankSorted.length - 2]
                : rankSorted[rankSorted.length - 1];
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);

            let typeScore = HAND_TYPE.STRAIGHT;
            if (rankSorted.join(",") === ROYAL_STRAIGHT && suitSet.size === 1) {
                typeScore = HAND_TYPE.ROYAL_FLUSH;
            } else if (suitSet.size === 1) {
                typeScore = HAND_TYPE.STRAIGHT_FLUSH;
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
                        ? HAND_TYPE.FLUSH
                        : HAND_TYPE.HIGH_CARD,
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
                typeScore: twoPairs ? HAND_TYPE.TWO_PAIR : HAND_TYPE.ONE_PAIR,
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
                    ? HAND_TYPE.FULL_HOUSE
                    : HAND_TYPE.THREE_OF_A_KIND,
                rankScore: maxRank,
                suitScore: maxSuit,
            };
        }
        if (isFourOfAKind(sameRankCounter)) {
            let quad = sameRankCounter.get(4) || [];
            const maxRank = getMax(quad);
            const maxSuit = getMaxSuitByMaxRank(rankMap, maxRank);
            return {
                typeScore: HAND_TYPE.FOUR_OF_A_KIND,
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
