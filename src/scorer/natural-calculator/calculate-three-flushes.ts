import { HandType, NaturalType } from "../../const";
import { statisticCard } from "../../helper/card-helpers";
import { Hand, NaturalScore, SegmentScore } from "../../types";

export const calculateThreeFlushes = (
    hand: Hand<number[]>,
    handScore: Hand<SegmentScore>,
): NaturalScore | undefined => {
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
            type: NaturalType.ThreeFlushes,
            rank: handScore.back.rank,
            suit: Math.max(...hand.back) % 4,
        };
    }

    return undefined;
};
